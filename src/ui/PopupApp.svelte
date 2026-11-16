<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import OptionRow from "./components/OptionRow.svelte";
  import CustomSelect from "./components/CustomSelect.svelte";
  import HotkeyModal from "./components/HotkeyModal.svelte";
  import ToastContainer from "./components/ToastContainer.svelte";
  import { getVisibleCharacterKeys } from "./character-rules";
  import {
    CHARACTER_SETTINGS,
    OPTIONS_LIST,
    getActiveTab,
    getAssetUrl,
    getCharacterFromTab,
    getOpenVttTabs,
    loadColorScheme,
    loadStoredSettings,
    openToolWindow,
    saveColorScheme,
    saveStoredSettings,
    type ColorScheme
  } from "./chrome-adapter";
  import { toasts } from "./stores/toasts.svelte";
  import type { CharacterInfo, SettingsMap, TabInfo } from "./types";

  interface RenderedGroup {
    id: string;
    label: string;
    badge?: string;
    scope: "global" | "character" | "vtt-tab";
    keys: string[];
  }

  const EFFECT_KEYS = [
    "effects-exhaustion-2024",
    "effects-exhaustion-2014",
    "effects-bless",
    "effects-bane",
    "effects-enlarge",
    "effects-reduce"
  ];

  const CHAR_OVERRIDE_KEYS = [
    "custom-roll-dice",
    "custom-damage-dice",
    "custom-ability-modifier",
    "custom-critical-limit",
    "discord-target"
  ];

  const GROUP_DEFS: { id: string; label: string; badge: string }[] = [
    { id: "rolling", label: "Rolling & Dice", badge: "Core" },
    { id: "dndbeyond", label: "D&D Beyond", badge: "DDB" },
    { id: "roll20", label: "Roll20", badge: "Roll20" },
    { id: "vtt", label: "Foundry & VTT Sync", badge: "VTT" },
    { id: "discord", label: "Discord", badge: "Discord" },
    { id: "backup", label: "Backup & Extension", badge: "System" }
  ];

  const KEY_TO_GROUP: Record<string, string> = {
    "whisper-type": "rolling",
    "whisper-type-monsters": "rolling",
    "roll-type": "rolling",
    "auto-roll-damage": "rolling",
    "critical-homebrew": "rolling",
    "weapon-force-critical": "rolling",
    "crit-prefix": "rolling",
    "weapon-handedness": "rolling",
    "hotkeys-bindings": "rolling",
    "sticky-hotkeys": "rolling",

    "use-digital-dice": "dndbeyond",
    "hide-results-with-digital-dice": "dndbeyond",
    "roll-to-game-log": "dndbeyond",
    "quick-rolls": "dndbeyond",
    "subst-dndbeyond": "dndbeyond",
    "subst-dndbeyond-stat-blocks": "dndbeyond",
    "handle-stat-blocks": "dndbeyond",
    "hidden-monster-replacement": "dndbeyond",
    "combat-unknown-monster-name": "dndbeyond",

    "roll20-template": "roll20",
    "roll20-discord-activity": "roll20",
    "roll20-spell-details-display": "roll20",
    "roll20-spell-description-display": "roll20",
    "components-display": "roll20",
    "component-prefix": "roll20",

    "vtt-tab": "vtt",
    "initiative-tracker": "vtt",
    "initiative-tiebreaker": "vtt",
    "update-hp": "vtt",
    "display-conditions": "vtt",
    "sync-combat-tracker": "vtt",
    "subst-vtt": "vtt",
    "notes-to-vtt": "vtt",
    "custom-domains": "vtt",

    "discord-integration": "discord",
    "discord-channels": "discord",
    "discord-display-description": "discord",
    "hide-results-on-whisper-to-discord": "discord",

    "backup-settings": "backup",
    "restore-settings": "backup",
    "show-changelog": "backup"
  };

  let settings = $state<SettingsMap>({});
  let charSettings = $state<SettingsMap>({});
  let character = $state<CharacterInfo | null>(null);
  let currentTab = $state<TabInfo | null>(null);
  let vttTabs = $state<TabInfo[]>([]);
  let loading = $state(true);

  let activeFilter = $state<string>("quick");
  let search = $state("");
  let hotkeyModalOpen = $state(false);
  let colorScheme = $state<ColorScheme>("auto");

  const isRoll20 = $derived(!!currentTab && /roll20/i.test(currentTab.title));
  const isFvtt = $derived(!!currentTab && /foundry/i.test(currentTab.title));
  const isMonster = $derived(!!currentTab && /\/(monsters|vehicles)\//.test(currentTab.url));
  const isDdb = $derived(!!currentTab && /dndbeyond\.com/i.test(currentTab.url));
  const isStandby = $derived(!character && !isRoll20 && !isFvtt && !isMonster && !isDdb);

  const vttTheme = $derived.by(() => {
    if (isFvtt) return "fvtt";
    if (isRoll20) return "roll20";
    if (character || isMonster || isDdb) return "dndbeyond";
    return "default";
  });

  const contextBadge = $derived.by(() => {
    if (character) return character.name;
    if (isFvtt) return "Foundry VTT";
    if (isRoll20) return "Roll20";
    if (isMonster) return "Stat Block";
    if (isDdb) return "D&D Beyond";
    return "Standby";
  });

  const vttTabOptions = $derived([
    { value: "null", label: "All VTT Tabs" },
    ...vttTabs.map((vt) => ({
      value: JSON.stringify({ id: vt.id, title: vt.title }),
      label: vt.title
    }))
  ]);

  const discordTargetOptions = $derived.by(() => {
    const channels = (settings["discord-channels"] as { name: string; secret: string }[] | undefined) || [];
    return [
      { value: "", label: "Default Channel" },
      ...channels.map((ch) => ({ value: ch.secret, label: ch.name }))
    ];
  });

  const activeEffectsCount = $derived(
    EFFECT_KEYS.filter((k) => {
      const val = charSettings[k];
      return Boolean(val) && val !== "0" && val !== 0;
    }).length
  );

  const visibleCharacterKeys = $derived(
    character ? getVisibleCharacterKeys(character, CHARACTER_SETTINGS) : []
  );

  function matchesSearch(key: string, title?: string, short?: string, desc?: string): boolean {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const hay = `${key} ${title || ""} ${short || ""} ${desc || ""}`.toLowerCase();
    return hay.includes(q);
  }

  const displayedGroups = $derived.by(() => {
    const q = search.trim().toLowerCase();
    const filter = q ? "all" : activeFilter;
    const groups: RenderedGroup[] = [];

    // 1. Effects group (when on a character sheet)
    if (character && (filter === "all" || filter === "effects")) {
      const keys = EFFECT_KEYS.filter(
        (k) => k in CHARACTER_SETTINGS && matchesSearch(k, CHARACTER_SETTINGS[k].title, CHARACTER_SETTINGS[k].short, CHARACTER_SETTINGS[k].description)
      );
      if (keys.length > 0) {
        groups.push({
          id: "effects",
          label: "Active Effects & Conditions",
          badge: character.name,
          scope: "character",
          keys
        });
      }
    }

    // 2. Character class/feature options & overrides
    if (character && (filter === "all" || filter === "quick" || filter === "character")) {
      const pool = filter === "quick" ? visibleCharacterKeys : [...visibleCharacterKeys, ...CHAR_OVERRIDE_KEYS];
      const keys = pool.filter(
        (k) => k in CHARACTER_SETTINGS && matchesSearch(k, CHARACTER_SETTINGS[k].title, CHARACTER_SETTINGS[k].short, CHARACTER_SETTINGS[k].description)
      );
      if (keys.length > 0) {
        groups.push({
          id: "character",
          label: "Character Options",
          badge: character.name,
          scope: "character",
          keys
        });
      }
    }

    // 3. Global settings grouped by VTT / purpose
    if (filter !== "effects" && filter !== "character") {
      const buckets: Record<string, string[]> = {};
      for (const g of GROUP_DEFS) buckets[g.id] = [];
      buckets["other"] = [];

      for (const [key, def] of Object.entries(OPTIONS_LIST)) {
        if (def.hidden || !def.title || def.type === "migrate" || key === "donate" || key === "donate-advanced") {
          continue;
        }
        if (filter === "quick") {
          const isQuick = Boolean(def.short) && !def.advanced;
          const isMonsterQuick = isMonster && ["whisper-type-monsters", "subst-dndbeyond-stat-blocks", "handle-stat-blocks"].includes(key);
          const isVttQuick = (isRoll20 || isFvtt) && (key === "display-conditions" || key === "vtt-tab" || (isRoll20 && key === "roll20-template"));
          if (!isQuick && !isMonsterQuick && !isVttQuick) continue;
        }
        if (!matchesSearch(key, def.title, def.short, def.description)) continue;
        const gid = KEY_TO_GROUP[key] || "other";
        buckets[gid].push(key);
      }

      for (const g of GROUP_DEFS) {
        if (filter !== "all" && filter !== "quick" && filter !== g.id) continue;
        if (buckets[g.id].length > 0) {
          groups.push({ id: g.id, label: g.label, badge: g.badge, scope: "global", keys: buckets[g.id] });
        }
      }
      if ((filter === "all" || filter === "quick" || filter === "other") && buckets["other"].length > 0) {
        groups.push({ id: "other", label: "Other", scope: "global", keys: buckets["other"] });
      }
    }

    return groups;
  });

  onMount(async () => {
    const [tab, loaded, vtts, scheme] = await Promise.all([
      getActiveTab(),
      loadStoredSettings("settings", OPTIONS_LIST),
      getOpenVttTabs(),
      loadColorScheme()
    ]);
    currentTab = tab;
    settings = loaded;
    vttTabs = vtts;
    colorScheme = scheme;

    if (tab && /\/characters\//.test(tab.url)) {
      const ch = await getCharacterFromTab(tab.id);
      if (ch) {
        character = ch;
        charSettings = await loadStoredSettings(`character-${ch.id}`, CHARACTER_SETTINGS);
      }
    }
    loading = false;
  });

  async function updateGlobal(name: string, value: unknown) {
    settings = { ...settings, [name]: value };
    await saveStoredSettings(settings, "settings", "general");
    toasts.push("Saved setting", "success", 1500);
  }

  async function updateCharacter(name: string, value: unknown) {
    if (!character) return;
    charSettings = { ...charSettings, [name]: value };
    await saveStoredSettings(charSettings, `character-${character.id}`, "character", character.id);
    toasts.push(`Updated ${character.name}`, "success", 1500);
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify({ settings }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "beyond20-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    toasts.push("Downloaded beyond20-backup.json", "success");
  }

  async function cycleColorScheme() {
    const next: ColorScheme = colorScheme === "auto" ? "light" : colorScheme === "light" ? "dark" : "auto";
    colorScheme = next;
    await saveColorScheme(next);
  }
</script>

<div class="b20-shell" data-vtt={vttTheme} data-color-scheme={colorScheme}>
  <header class="b20-header">
    <div class="b20-brand">
      <img src={getAssetUrl("images/icons/icon32.png")} alt="Beyond20" class="b20-logo" />
      <div class="b20-titles">
        <span class="b20-title">Beyond20</span>
        <span class="b20-badge">{contextBadge}</span>
      </div>
    </div>
    <div class="b20-header-actions">
      <button
        type="button"
        class="b20-btn"
        title="Switch color theme (Auto / Light / Dark)"
        onclick={cycleColorScheme}
      >
        {colorScheme === "light" ? "☀ Light" : colorScheme === "dark" ? "🌙 Dark" : "◐ Auto"}
      </button>
      {#if !isStandby}
        <button
          type="button"
          class="b20-btn"
          class:active={activeFilter === "all"}
          onclick={() => (activeFilter = activeFilter === "all" ? "quick" : "all")}
        >
          {activeFilter === "all" ? "Quick View" : "Show All"}
        </button>
      {/if}
    </div>
  </header>

  {#if !isStandby}
    <div class="b20-toolbar">
      <input
        type="search"
        class="b20-search"
        placeholder="Search all settings, effects, or character options…"
        bind:value={search}
        aria-label="Search all settings"
      />
      <div class="b20-filter-pills" role="group" aria-label="Filter settings by category">
        <button type="button" class="b20-pill" class:active={activeFilter === "quick"} onclick={() => (activeFilter = "quick")}>
          Quick
        </button>
        <button type="button" class="b20-pill" class:active={activeFilter === "all"} onclick={() => (activeFilter = "all")}>
          All
        </button>
        {#if character}
          <button type="button" class="b20-pill" class:active={activeFilter === "character"} onclick={() => (activeFilter = "character")}>
            Character
          </button>
          <button type="button" class="b20-pill" class:active={activeFilter === "effects"} onclick={() => (activeFilter = "effects")}>
            Effects
            {#if activeEffectsCount > 0}
              <span class="b20-count" transition:fade={{ duration: 120 }}>{activeEffectsCount}</span>
            {/if}
          </button>
        {/if}
        {#each GROUP_DEFS as g}
          <button type="button" class="b20-pill" class:active={activeFilter === g.id} onclick={() => (activeFilter = g.id)}>
            {g.badge}
          </button>
        {/each}
      </div>
    </div>
  {/if}

  <main class="b20-main">
    {#if loading}
      <p class="b20-loading">Loading settings…</p>
    {:else if isStandby}
      <div class="b20-standby-card" in:fade={{ duration: 120 }}>
        <h4>Not a D&amp;D Beyond or VTT page</h4>
        <p>Beyond20 activates automatically on D&amp;D Beyond, Roll20, and Foundry VTT pages.</p>
      </div>
    {:else}
      <div class="b20-groups" in:fade={{ duration: 120 }}>
        {#each displayedGroups as group (group.id)}
          <section class="b20-group">
            <div class="b20-group-header">
              <span class="b20-group-title">{group.label}</span>
              {#if group.badge}
                <span class="b20-group-badge">{group.badge}</span>
              {/if}
            </div>
            <ul class="b20-list">
              {#each group.keys as key (key)}
                {#if group.scope === "character" && key === "discord-target"}
                  <li class="b20-special-card">
                    <div>
                      <h4>{CHARACTER_SETTINGS[key].title}</h4>
                      <p>{CHARACTER_SETTINGS[key].description}</p>
                    </div>
                    <CustomSelect
                      id="discord-target-select"
                      value={String(charSettings[key] || "")}
                      options={discordTargetOptions}
                      onChange={(val) => updateCharacter(key, val)}
                    />
                  </li>
                {:else if group.scope === "character"}
                  <OptionRow
                    name={key}
                    option={CHARACTER_SETTINGS[key]}
                    value={charSettings[key]}
                    onChange={updateCharacter}
                  />
                {:else if key === "vtt-tab"}
                  <li class="b20-special-card">
                    <div>
                      <h4>Send Beyond20 rolls to</h4>
                      <p>Restrict which open VTT tab receives rolls</p>
                    </div>
                    <CustomSelect
                      id="vtt-tab-select"
                      value={JSON.stringify(settings["vtt-tab"] || null)}
                      options={vttTabOptions}
                      onChange={(raw) => {
                        const val = raw === "null" ? null : JSON.parse(raw);
                        updateGlobal("vtt-tab", val);
                      }}
                    />
                  </li>
                {:else if key === "hotkeys-bindings"}
                  <li class="b20-special-card">
                    <div>
                      <h4>{OPTIONS_LIST[key].title}</h4>
                      <p>{OPTIONS_LIST[key].description}</p>
                    </div>
                    <button type="button" class="b20-action-btn" onclick={() => (hotkeyModalOpen = true)}>
                      Manage ({Object.keys((settings[key] as Record<string, string>) || {}).length})
                    </button>
                  </li>
                {:else if key === "discord-channels"}
                  <li class="b20-special-card">
                    <div>
                      <h4>{OPTIONS_LIST[key].title}</h4>
                      <p>Opens a separate window so copying webhook keys won't close the popup</p>
                    </div>
                    <button type="button" class="b20-action-btn" onclick={() => openToolWindow("discord", vttTheme)}>
                      Open Window ↗
                    </button>
                  </li>
                {:else if key === "custom-domains"}
                  <li class="b20-special-card">
                    <div>
                      <h4>{OPTIONS_LIST[key].title}</h4>
                      <p>{OPTIONS_LIST[key].description}</p>
                    </div>
                    <button type="button" class="b20-action-btn" onclick={() => openToolWindow("domains", vttTheme)}>
                      Edit Domains ↗
                    </button>
                  </li>
                {:else if key === "backup-settings"}
                  <li class="b20-special-card">
                    <div>
                      <h4>{OPTIONS_LIST[key].title}</h4>
                      <p>{OPTIONS_LIST[key].description}</p>
                    </div>
                    <button type="button" class="b20-action-btn" onclick={exportBackup}>
                      Download JSON
                    </button>
                  </li>
                {:else if key === "restore-settings"}
                  <li class="b20-special-card">
                    <div>
                      <h4>{OPTIONS_LIST[key].title}</h4>
                      <p>Opens a drag-and-drop restore window</p>
                    </div>
                    <button type="button" class="b20-action-btn" onclick={() => openToolWindow("restore", vttTheme)}>
                      Restore ↗
                    </button>
                  </li>
                {:else if OPTIONS_LIST[key].type !== "special"}
                  <OptionRow
                    name={key}
                    option={OPTIONS_LIST[key]}
                    short={activeFilter === "quick"}
                    value={settings[key]}
                    lockValue={Boolean(OPTIONS_LIST[key].lock && settings[OPTIONS_LIST[key].lock!])}
                    onChange={updateGlobal}
                    onLockChange={updateGlobal}
                  />
                {/if}
              {/each}
            </ul>
          </section>
        {:else}
          <p class="b20-loading">No settings match "{search}".</p>
        {/each}
      </div>
    {/if}
  </main>

  {#if OPTIONS_LIST["donate"]}
    <footer class="b20-patron-footer">
      <a
        class="b20-patron-card"
        href={String(OPTIONS_LIST["donate"].default || "https://beyond20.here-for-more.info/support")}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={getAssetUrl("images/donate32.png")}
          width="28"
          height="28"
          alt="Support Beyond20"
        />
        <div class="b20-patron-text">
          <h4>{OPTIONS_LIST["donate"].title}</h4>
        </div>
        <span class="b20-patron-cta">Support →</span>
      </a>
    </footer>
  {/if}

  <HotkeyModal
    open={hotkeyModalOpen}
    bindings={(settings["hotkeys-bindings"] as Record<string, string>) || {}}
    onSave={(updated) => updateGlobal("hotkeys-bindings", updated)}
    onClose={() => (hotkeyModalOpen = false)}
  />

  <ToastContainer />
</div>

<style>
  .b20-shell {
    min-width: 560px;
    max-width: 640px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--b20-bg);
    color: var(--b20-text);
  }

  .b20-header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 14px;
    background: var(--b20-surface);
    border-bottom: 1px solid var(--b20-border);
    box-shadow: var(--b20-shadow-sm);
  }

  .b20-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
  .b20-header-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .b20-logo { width: 26px; height: 26px; border-radius: 6px; }
  .b20-titles { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .b20-title { font-size: 15px; font-weight: 700; }

  .b20-badge {
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
    border-radius: 999px;
    background: var(--b20-accent-soft);
    color: var(--b20-accent);
    max-width: 165px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .b20-btn,
  .b20-action-btn {
    padding: 6px 11px;
    border-radius: 8px;
    border: 1px solid var(--b20-border);
    background: var(--b20-surface-subtle);
    color: var(--b20-text);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
  }

  .b20-btn.active {
    background: var(--b20-accent);
    border-color: var(--b20-accent);
    color: #fff;
  }

  .b20-toolbar {
    position: sticky;
    top: 49px;
    z-index: 90;
    padding: 9px 14px;
    background: var(--b20-bg);
    border-bottom: 1px solid var(--b20-border);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .b20-search {
    width: 100%;
    padding: 7px 11px;
    border-radius: 8px;
    border: 1px solid var(--b20-border);
    background: var(--b20-surface);
    color: var(--b20-text);
    font-size: 13px;
    outline: none;
  }

  .b20-search:focus {
    border-color: var(--b20-accent);
    box-shadow: 0 0 0 3px var(--b20-accent-soft);
  }

  .b20-filter-pills { display: flex; flex-wrap: wrap; gap: 5px; }

  .b20-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 9px;
    border-radius: 999px;
    border: 1px solid var(--b20-border);
    background: var(--b20-surface);
    color: var(--b20-text-muted);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .b20-pill:hover {
    border-color: var(--b20-accent);
    color: var(--b20-text);
  }

  .b20-pill.active {
    background: var(--b20-accent);
    border-color: var(--b20-accent);
    color: #fff;
  }

  .b20-count {
    padding: 0 5px;
    font-size: 10px;
    font-weight: 700;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.25);
    color: inherit;
  }

  .b20-main {
    flex: 1;
    padding: 10px 14px 16px;
  }

  .b20-standby-card {
    padding: 11px 14px;
    border-radius: var(--b20-radius);
    background: var(--b20-info-bg);
    border: 1px solid var(--b20-info-border);
    color: var(--b20-info-text);
  }

  .b20-standby-card h4 { margin: 0; font-size: 13px; }
  .b20-standby-card p { margin: 3px 0 0; font-size: 12px; }

  .b20-groups { display: flex; flex-direction: column; gap: 14px; }

  .b20-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 4px 5px;
  }

  .b20-group-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--b20-text-muted);
  }

  .b20-group-badge {
    padding: 1px 8px;
    border-radius: 999px;
    font-size: 10.5px;
    font-weight: 700;
    background: var(--b20-accent-soft);
    color: var(--b20-accent);
  }

  .b20-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .b20-special-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: var(--b20-surface);
    border: 1px solid var(--b20-border);
    border-radius: var(--b20-radius);
    padding: 11px 14px;
  }

  .b20-special-card h4 { margin: 0; font-size: 13.5px; font-weight: 600; }
  .b20-special-card p { margin: 2px 0 0; font-size: 12px; color: var(--b20-text-muted); }

  .b20-patron-footer {
    position: sticky;
    bottom: 0;
    z-index: 95;
    padding: 8px 14px 10px;
    margin-top: auto;
    background: var(--b20-bg);
    border-top: 1px solid var(--b20-border);
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.12);
  }

  .b20-patron-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: var(--b20-radius);
    background: var(--b20-surface);
    border: 1px solid var(--b20-border);
    text-decoration: none;
    color: inherit;
  }

  .b20-patron-card:hover { border-color: var(--b20-accent); }
  .b20-patron-card img { border-radius: 6px; flex-shrink: 0; }
  .b20-patron-text { flex: 1; min-width: 0; }
  .b20-patron-text h4 { margin: 0; font-size: 12.5px; font-weight: 600; }

  .b20-patron-cta {
    flex-shrink: 0;
    padding: 4px 9px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    background: var(--b20-accent-soft);
    color: var(--b20-accent);
  }

  .b20-loading {
    text-align: center;
    color: var(--b20-text-muted);
    padding: 24px 0;
  }
</style>
