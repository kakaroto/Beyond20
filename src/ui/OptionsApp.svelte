<script lang="ts">
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import OptionRow from "./components/OptionRow.svelte";
  import HotkeyModal from "./components/HotkeyModal.svelte";
  import ToastContainer from "./components/ToastContainer.svelte";
  import {
    OPTIONS_LIST,
    getActiveTab,
    getAssetUrl,
    loadStoredSettings,
    saveStoredSettings
  } from "./chrome-adapter";
  import { toasts } from "./stores/toasts.svelte";
  import type { SettingsMap } from "./types";

  interface OptionGroup {
    id: string;
    label: string;
    badge?: string;
    keys: string[];
  }

  const GROUP_DEFS: Omit<OptionGroup, "keys">[] = [
    { id: "rolling", label: "General & Rolling", badge: "Core" },
    { id: "dndbeyond", label: "D&D Beyond", badge: "DDB" },
    { id: "roll20", label: "Roll20", badge: "Roll20" },
    { id: "vtt", label: "Foundry VTT & All VTTs", badge: "VTT" },
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
  let showAdvanced = $state(false);
  let selectedGroup = $state<string>("all");
  let search = $state("");
  let hotkeyModalOpen = $state(false);
  let customDomainsText = $state("");
  let loading = $state(true);
  let vttTheme = $state<"dndbeyond" | "roll20" | "fvtt" | "default">("dndbeyond");

  const filteredGroups = $derived.by(() => {
    const q = search.trim().toLowerCase();
    const buckets: Record<string, string[]> = {};
    for (const g of GROUP_DEFS) buckets[g.id] = [];
    buckets["other"] = [];

    for (const [key, def] of Object.entries(OPTIONS_LIST)) {
      if (def.hidden || !def.title || def.type === "migrate" || key === "donate" || key === "donate-advanced") continue;
      if (!q) {
        if (showAdvanced ? !def.advanced : Boolean(def.advanced)) continue;
      } else {
        const hay = `${key} ${def.title} ${def.description || ""}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }
      const gid = KEY_TO_GROUP[key] || "other";
      buckets[gid].push(key);
    }

    const result: OptionGroup[] = [];
    for (const g of GROUP_DEFS) {
      if (selectedGroup !== "all" && selectedGroup !== g.id) continue;
      if (buckets[g.id].length > 0) {
        result.push({ ...g, keys: buckets[g.id] });
      }
    }
    if ((selectedGroup === "all" || selectedGroup === "other") && buckets["other"].length > 0) {
      result.push({ id: "other", label: "Other", keys: buckets["other"] });
    }
    return result;
  });

  onMount(async () => {
    const [loaded, tab] = await Promise.all([
      loadStoredSettings("settings", OPTIONS_LIST),
      getActiveTab()
    ]);
    settings = loaded;
    if (/foundry/i.test(tab.title)) vttTheme = "fvtt";
    else if (/roll20/i.test(tab.title)) vttTheme = "roll20";
    else if (/dndbeyond\.com/i.test(tab.url)) vttTheme = "dndbeyond";
    else vttTheme = "default";
    const domains = settings["custom-domains"];
    if (Array.isArray(domains)) {
      customDomainsText = domains.join("\n");
    }
    loading = false;
  });

  async function updateSetting(name: string, value: unknown) {
    settings = { ...settings, [name]: value };
    await saveStoredSettings(settings, "settings", "general");
    toasts.push("Settings auto-saved", "success", 1600);
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify({ settings }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "beyond20-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    toasts.push("Exported settings backup", "success");
  }

  async function importBackup(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const restored = parsed.settings || parsed;
      settings = { ...settings, ...restored };
      await saveStoredSettings(settings, "settings", "general");
      toasts.push("Restored settings from backup", "success");
    } catch {
      toasts.push("Invalid backup JSON file", "error");
    }
  }
</script>

<div class="b20-shell" data-vtt={vttTheme}>
  <header class="b20-header">
    <div class="b20-brand">
      <img src={getAssetUrl("images/icons/icon32.png")} alt="Beyond20" class="b20-logo" />
      <span class="b20-title">Beyond20 Options</span>
    </div>
    <button
      type="button"
      class="b20-pill-btn"
      class:active={showAdvanced}
      onclick={() => (showAdvanced = !showAdvanced)}
    >
      {showAdvanced ? "Basic Options" : "Advanced Options"}
    </button>
  </header>

  <div class="b20-search-wrap">
    <input
      type="search"
      class="b20-search"
      placeholder="Search all settings (basic & advanced)…"
      bind:value={search}
      aria-label="Search settings"
    />
    <div class="b20-filter-pills">
      <button
        type="button"
        class="b20-filter-pill"
        class:active={selectedGroup === "all"}
        onclick={() => (selectedGroup = "all")}
      >
        All
      </button>
      {#each GROUP_DEFS as g}
        <button
          type="button"
          class="b20-filter-pill"
          class:active={selectedGroup === g.id}
          onclick={() => (selectedGroup = g.id)}
        >
          {g.badge || g.label}
        </button>
      {/each}
    </div>
  </div>

  <main class="b20-main">
    {#if loading}
      <p class="b20-loading">Loading options…</p>
    {:else if filteredGroups.length === 0}
      <p class="b20-loading">No settings match your current filter.</p>
    {:else}
      <div class="b20-groups" in:fade={{ duration: 120 }}>
        {#each filteredGroups as group (group.id)}
          <section class="b20-group">
            <div class="b20-group-header">
              <span class="b20-group-title">{group.label}</span>
              {#if group.badge}
                <span class="b20-group-badge">{group.badge}</span>
              {/if}
            </div>
            <ul class="b20-list">
              {#each group.keys as key (key)}
                {#if key === "hotkeys-bindings"}
                  <li class="b20-special-card">
                    <div>
                      <h4>{OPTIONS_LIST[key].title}</h4>
                      <p>{OPTIONS_LIST[key].description}</p>
                    </div>
                    <button type="button" class="b20-action-btn" onclick={() => (hotkeyModalOpen = true)}>
                      Manage Hotkeys ({Object.keys((settings[key] as Record<string, string>) || {}).length})
                    </button>
                  </li>
                {:else if key === "custom-domains"}
                  <li class="b20-special-card b20-special-col">
                    <div class="b20-special-top">
                      <div>
                        <h4>{OPTIONS_LIST[key].title}</h4>
                        <p>{OPTIONS_LIST[key].description}</p>
                      </div>
                      <button
                        type="button"
                        class="b20-action-btn"
                        onclick={() => {
                          const list = customDomainsText.split("\n").map((s) => s.trim()).filter(Boolean);
                          updateSetting("custom-domains", list);
                        }}
                      >
                        Apply Domains
                      </button>
                    </div>
                    <textarea
                      rows="3"
                      class="b20-textarea"
                      bind:value={customDomainsText}
                      placeholder="https://my-foundry.example.com/*"
                    ></textarea>
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
                      <p>{OPTIONS_LIST[key].description}</p>
                    </div>
                    <label class="b20-action-btn">
                      Upload JSON
                      <input type="file" accept="application/json" onchange={importBackup} hidden />
                    </label>
                  </li>
                {:else if OPTIONS_LIST[key].type !== "special"}
                  <OptionRow
                    name={key}
                    option={OPTIONS_LIST[key]}
                    value={settings[key]}
                    lockValue={Boolean(OPTIONS_LIST[key].lock && settings[OPTIONS_LIST[key].lock!])}
                    onChange={updateSetting}
                    onLockChange={updateSetting}
                  />
                {/if}
              {/each}
            </ul>
          </section>
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
          width="32"
          height="32"
          alt="Support Beyond20"
        />
        <div class="b20-patron-text">
          <h4>{OPTIONS_LIST["donate"].title}</h4>
          <p>{OPTIONS_LIST["donate"].description}</p>
        </div>
        <span class="b20-patron-cta">Support →</span>
      </a>
    </footer>
  {/if}

  <HotkeyModal
    open={hotkeyModalOpen}
    bindings={(settings["hotkeys-bindings"] as Record<string, string>) || {}}
    onSave={(updated) => updateSetting("hotkeys-bindings", updated)}
    onClose={() => (hotkeyModalOpen = false)}
  />

  <ToastContainer />
</div>

<style>
  .b20-shell {
    min-width: 500px;
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
    padding: 12px 16px;
    background: var(--b20-surface);
    border-bottom: 1px solid var(--b20-border);
  }

  .b20-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .b20-logo {
    width: 28px;
    height: 28px;
    border-radius: 6px;
  }

  .b20-title {
    font-size: 15px;
    font-weight: 700;
  }

  .b20-pill-btn,
  .b20-action-btn {
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--b20-border);
    background: var(--b20-surface-subtle);
    color: var(--b20-text);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    flex-shrink: 0;
  }

  .b20-pill-btn.active {
    background: var(--b20-accent);
    border-color: var(--b20-accent);
    color: #fff;
  }

  .b20-search-wrap {
    padding: 10px 14px 4px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .b20-filter-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .b20-filter-pill {
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid var(--b20-border);
    background: var(--b20-surface);
    color: var(--b20-text-muted);
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .b20-filter-pill:hover {
    border-color: var(--b20-accent);
    color: var(--b20-text);
  }

  .b20-filter-pill.active {
    background: var(--b20-accent);
    border-color: var(--b20-accent);
    color: #fff;
  }

  .b20-groups {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .b20-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 4px 6px;
  }

  .b20-group-title {
    font-size: 11.5px;
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

  .b20-search {
    width: 100%;
    padding: 8px 12px;
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

  .b20-main {
    flex: 1;
    padding: 10px 14px 20px;
  }

  .b20-patron-footer {
    position: sticky;
    bottom: 0;
    z-index: 95;
    padding: 10px 14px 12px;
    margin-top: auto;
    background: var(--b20-bg);
    border-top: 1px solid var(--b20-border);
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.12);
  }

  .b20-patron-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: var(--b20-radius);
    background: var(--b20-surface);
    border: 1px solid var(--b20-border);
    box-shadow: var(--b20-shadow-sm);
    text-decoration: none;
    color: inherit;
    transition: border-color 0.15s ease, background-color 0.15s ease;
  }

  .b20-patron-card:hover {
    background: var(--b20-surface-hover);
    border-color: var(--b20-accent);
  }

  .b20-patron-card img {
    border-radius: 8px;
    flex-shrink: 0;
  }

  .b20-patron-text {
    flex: 1;
    min-width: 0;
  }

  .b20-patron-text h4 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--b20-text);
  }

  .b20-patron-text p {
    margin: 2px 0 0;
    font-size: 11.5px;
    line-height: 1.35;
    color: var(--b20-text-muted);
    white-space: pre-line;
  }

  .b20-patron-cta {
    flex-shrink: 0;
    padding: 5px 10px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 600;
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
    gap: 14px;
    padding: 12px 14px;
    background: var(--b20-surface);
    border: 1px solid var(--b20-border);
    border-radius: var(--b20-radius);
  }

  .b20-special-col {
    flex-direction: column;
    align-items: stretch;
  }

  .b20-special-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  .b20-special-card h4 {
    margin: 0;
    font-size: 13.5px;
    font-weight: 600;
  }

  .b20-special-card p {
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--b20-text-muted);
  }

  .b20-textarea {
    width: 100%;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--b20-border);
    background: var(--b20-surface-subtle);
    color: var(--b20-text);
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
  }

  .b20-loading {
    text-align: center;
    color: var(--b20-text-muted);
    padding: 24px 0;
  }
</style>
