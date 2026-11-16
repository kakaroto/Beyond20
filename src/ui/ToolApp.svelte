<script lang="ts">
  import { onMount } from "svelte";
  import ToastContainer from "./components/ToastContainer.svelte";
  import {
    OPTIONS_LIST,
    getAssetUrl,
    loadColorScheme,
    loadStoredSettings,
    saveStoredSettings,
    type ColorScheme,
    type ToolWindowKind
  } from "./chrome-adapter";
  import { toasts } from "./stores/toasts.svelte";
  import type { SettingsMap } from "./types";

  interface DiscordChannel {
    name: string;
    secret: string;
  }

  const params = new URLSearchParams(window.location.search);
  const tool = (params.get("tool") || "restore") as ToolWindowKind;
  const vttParam = params.get("vtt") || params.get("context") || "dndbeyond";
  const vttTheme =
    vttParam === "roll20" || vttParam === "fvtt" || vttParam === "default"
      ? vttParam
      : "dndbeyond";

  let settings = $state<SettingsMap>({});
  let loading = $state(true);
  let colorScheme = $state<ColorScheme>("auto");

  // Restore state
  let dragging = $state(false);
  let pendingBackup = $state<SettingsMap | null>(null);
  let pendingFileName = $state("");

  // Discord state
  let channels = $state<DiscordChannel[]>([]);
  let newChanName = $state("");
  let newChanSecret = $state("");

  // Domains state
  let domainsText = $state("");

  onMount(async () => {
    const [loaded, scheme] = await Promise.all([
      loadStoredSettings("settings", OPTIONS_LIST),
      loadColorScheme()
    ]);
    settings = loaded;
    colorScheme = scheme;
    const rawDomains = settings["custom-domains"];
    if (Array.isArray(rawDomains)) {
      domainsText = rawDomains.join("\n");
    }
    const rawChannels = settings["discord-channels"];
    if (Array.isArray(rawChannels)) {
      channels = rawChannels as DiscordChannel[];
    }
    loading = false;
  });

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const restored = (parsed.settings || parsed) as SettingsMap;
      pendingBackup = restored;
      pendingFileName = file.name;
      toasts.push(`Loaded ${Object.keys(restored).length} settings from ${file.name}`, "info");
    } catch {
      toasts.push("Invalid JSON backup file", "error");
    }
  }

  async function applyRestore() {
    if (!pendingBackup) return;
    settings = { ...settings, ...pendingBackup };
    await saveStoredSettings(settings, "settings", "general");
    toasts.push("Settings restored successfully!", "success");
    pendingBackup = null;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    handleFile(e.dataTransfer?.files?.[0]);
  }

  async function addDiscordChannel() {
    if (!newChanName.trim() || !newChanSecret.trim()) {
      toasts.push("Enter both a channel name and webhook secret.", "warning");
      return;
    }
    channels = [...channels, { name: newChanName.trim(), secret: newChanSecret.trim() }];
    settings = { ...settings, "discord-channels": channels };
    await saveStoredSettings(settings, "settings", "general");
    newChanName = "";
    newChanSecret = "";
    toasts.push("Added Discord channel", "success");
  }

  async function removeDiscordChannel(idx: number) {
    channels = channels.filter((_, i) => i !== idx);
    settings = { ...settings, "discord-channels": channels };
    await saveStoredSettings(settings, "settings", "general");
    toasts.push("Removed Discord channel", "info");
  }

  async function saveDomains() {
    const list = domainsText.split("\n").map((s) => s.trim()).filter(Boolean);
    settings = { ...settings, "custom-domains": list };
    await saveStoredSettings(settings, "settings", "general");
    toasts.push(`Saved ${list.length} custom domain(s)`, "success");
  }

  const title = $derived(
    tool === "discord"
      ? "Discord Channels"
      : tool === "domains"
        ? "Custom Domains"
        : "Restore Settings"
  );
</script>

<div class="b20-tool-shell" data-vtt={vttTheme} data-color-scheme={colorScheme}>
  <header class="b20-header">
    <div class="b20-brand">
      <img src={getAssetUrl("images/icons/icon32.png")} alt="Beyond20" class="b20-logo" />
      <div>
        <div class="b20-title">{title}</div>
        <div class="b20-sub">Focus-persistent window — safe to switch apps or drop files</div>
      </div>
    </div>
  </header>

  <main class="b20-tool-main">
    {#if loading}
      <p class="b20-muted">Loading…</p>
    {:else if tool === "restore"}
      <div
        class="b20-dropzone"
        class:dragging
        role="region"
        aria-label="Backup JSON dropzone"
        ondragover={(e) => {
          e.preventDefault();
          dragging = true;
        }}
        ondragleave={() => (dragging = false)}
        ondrop={handleDrop}
      >
        <div class="b20-drop-icon" aria-hidden="true">📄</div>
        <h4>Drag &amp; drop your <code>beyond20-backup.json</code> here</h4>
        <p>or choose a file from your computer</p>
        <label class="b20-primary-btn">
          Browse JSON File
          <input
            type="file"
            accept="application/json,.json"
            hidden
            onchange={(e) => handleFile(e.currentTarget.files?.[0])}
          />
        </label>
      </div>

      {#if pendingBackup}
        <div class="b20-preview-box">
          <div>
            <strong>{pendingFileName}</strong>
            <p>{Object.keys(pendingBackup).length} settings ready to restore</p>
          </div>
          <button type="button" class="b20-primary-btn" onclick={applyRestore}>
            Apply Restore
          </button>
        </div>
      {/if}
    {:else if tool === "discord"}
      <div class="b20-card">
        <h4>Add Discord Destination Channel</h4>
        <div class="b20-form">
          <input
            type="text"
            class="b20-input"
            placeholder="Channel Name (e.g. #dice-rolls)"
            bind:value={newChanName}
          />
          <input
            type="text"
            class="b20-input"
            placeholder="Secret / Webhook Key"
            bind:value={newChanSecret}
          />
          <button type="button" class="b20-primary-btn" onclick={addDiscordChannel}>
            Add Channel
          </button>
        </div>
      </div>

      <ul class="b20-list">
        {#each channels as ch, idx}
          <li class="b20-item">
            <div>
              <strong>{ch.name}</strong>
              <p>{ch.secret.slice(0, 12)}…</p>
            </div>
            <button type="button" class="b20-del" onclick={() => removeDiscordChannel(idx)}>
              Delete
            </button>
          </li>
        {:else}
          <li class="b20-muted">No Discord channels configured yet.</li>
        {/each}
      </ul>
    {:else if tool === "domains"}
      <div class="b20-card">
        <h4>Custom Domains</h4>
        <p class="b20-desc">One URL pattern per line (e.g. <code>https://my-foundry.example.com/*</code>)</p>
        <textarea rows="8" class="b20-textarea" bind:value={domainsText}></textarea>
        <button type="button" class="b20-primary-btn" onclick={saveDomains}>
          Save Custom Domains
        </button>
      </div>
    {/if}
  </main>

  <ToastContainer />
</div>

<style>
  .b20-tool-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--b20-bg);
    color: var(--b20-text);
  }

  .b20-header {
    padding: 12px 16px;
    background: var(--b20-surface);
    border-bottom: 1px solid var(--b20-border);
  }

  .b20-brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .b20-logo { width: 28px; height: 28px; border-radius: 6px; }
  .b20-title { font-size: 15px; font-weight: 700; }
  .b20-sub { font-size: 11.5px; color: var(--b20-text-muted); }

  .b20-tool-main {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .b20-dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 8px;
    padding: 34px 20px;
    border-radius: 14px;
    border: 2px dashed var(--b20-border);
    background: var(--b20-surface);
    transition: border-color 0.15s ease, background-color 0.15s ease, transform 0.15s ease;
  }

  .b20-dropzone.dragging {
    border-color: var(--b20-accent);
    background: var(--b20-accent-soft);
    transform: scale(1.01);
  }

  .b20-drop-icon { font-size: 28px; }
  .b20-dropzone h4 { margin: 0; font-size: 14px; }
  .b20-dropzone p { margin: 0 0 6px; font-size: 12px; color: var(--b20-text-muted); }

  .b20-preview-box,
  .b20-card,
  .b20-item {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    background: var(--b20-surface);
    border: 1px solid var(--b20-border);
    border-radius: var(--b20-radius);
  }

  .b20-preview-box,
  .b20-item {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .b20-preview-box p,
  .b20-item p,
  .b20-desc {
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--b20-text-muted);
  }

  .b20-card h4 { margin: 0; font-size: 14px; }
  .b20-form { display: flex; flex-direction: column; gap: 8px; }

  .b20-input,
  .b20-textarea {
    width: 100%;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--b20-border);
    background: var(--b20-surface-subtle);
    color: var(--b20-text);
    font-family: inherit;
    font-size: 13px;
  }

  .b20-textarea {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 12px;
  }

  .b20-primary-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 14px;
    border-radius: 8px;
    border: none;
    background: var(--b20-accent);
    color: #fff;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
  }

  .b20-primary-btn:hover { background: var(--b20-accent-hover); }

  .b20-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .b20-del {
    background: transparent;
    border: none;
    color: var(--b20-error);
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
  }

  .b20-muted {
    text-align: center;
    color: var(--b20-text-muted);
    font-size: 12.5px;
    padding: 12px;
  }
</style>
