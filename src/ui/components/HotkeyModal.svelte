<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import CustomSelect from "./CustomSelect.svelte";
  import { toasts } from "../stores/toasts.svelte";

  interface Props {
    open: boolean;
    bindings: Record<string, string>;
    onSave: (bindings: Record<string, string>) => void;
    onClose: () => void;
  }

  let { open, bindings, onSave, onClose }: Props = $props();

  let newKey = $state("");
  let newAction = $state("advantage");
  let recording = $state(false);

  const ACTIONS = [
    { value: "advantage", label: "Advantage" },
    { value: "disadvantage", label: "Disadvantage" },
    { value: "normal", label: "Normal Roll" },
    { value: "whisper", label: "Whisper Roll" },
    { value: "super-advantage", label: "Super Advantage" },
    { value: "super-disadvantage", label: "Super Disadvantage" }
  ];

  function handleKeyDown(e: KeyboardEvent) {
    if (!recording) return;
    e.preventDefault();
    if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return;
    newKey = e.key.toUpperCase();
    recording = false;
  }

  function addBinding() {
    if (!newKey.trim()) {
      toasts.push("Press a key first to bind a hotkey.", "warning");
      return;
    }
    const updated = { ...bindings, [newKey.trim()]: newAction };
    onSave(updated);
    toasts.push(`Bound "${newKey.trim()}" → ${newAction}`, "success");
    newKey = "";
  }

  function removeBinding(key: string) {
    const updated = { ...bindings };
    delete updated[key];
    onSave(updated);
    toasts.push(`Removed hotkey "${key}"`, "info");
  }
</script>

{#if open}
  <div class="b20-modal-backdrop" transition:fade={{ duration: 150 }} role="presentation" onclick={onClose}>
    <div
      class="b20-modal"
      transition:scale={{ start: 0.94, duration: 180 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hotkey-modal-title"
      onclick={(e) => e.stopPropagation()}
      onkeydown={handleKeyDown}
    >
      <div class="b20-modal-header">
        <h3 id="hotkey-modal-title">Hotkey Bindings</h3>
        <button type="button" class="b20-close" onclick={onClose} aria-label="Close">×</button>
      </div>

      <div class="b20-modal-body">
        <div class="b20-hotkey-add">
          <button
            type="button"
            class="b20-key-btn"
            class:recording
            onclick={() => (recording = !recording)}
          >
            {recording ? "Press any key..." : newKey || "Click & press key"}
          </button>
          <CustomSelect
            value={newAction}
            options={ACTIONS}
            onChange={(val) => (newAction = val)}
          />
          <button type="button" class="b20-add-btn" onclick={addBinding}>Add</button>
        </div>

        {#if Object.keys(bindings).length === 0}
          <p class="b20-empty">No custom hotkeys configured yet.</p>
        {:else}
          <ul class="b20-hotkey-list">
            {#each Object.entries(bindings) as [key, action]}
              <li>
                <kbd>{key}</kbd>
                <span>{action}</span>
                <button type="button" class="b20-del" onclick={() => removeBinding(key)} aria-label="Delete {key}">
                  Remove
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .b20-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 5000;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .b20-modal {
    width: 100%;
    max-width: 420px;
    background: var(--b20-surface);
    border: 1px solid var(--b20-border);
    border-radius: 14px;
    box-shadow: var(--b20-shadow-md);
    overflow: hidden;
  }

  .b20-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--b20-border);
  }

  .b20-modal-header h3 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
  }

  .b20-close {
    background: transparent;
    border: none;
    color: var(--b20-text-muted);
    font-size: 20px;
    cursor: pointer;
  }

  .b20-modal-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .b20-hotkey-add {
    display: flex;
    gap: 8px;
  }

  .b20-key-btn {
    flex: 1;
    padding: 7px 10px;
    border-radius: 8px;
    border: 1px dashed var(--b20-border);
    background: var(--b20-surface-subtle);
    color: var(--b20-text);
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
  }

  .b20-key-btn.recording {
    border-color: var(--b20-accent);
    background: var(--b20-accent-soft);
    color: var(--b20-accent);
  }

  .b20-select {
    font-family: inherit;
    font-size: 12.5px;
    color: var(--b20-text);
    background: var(--b20-surface-subtle);
    border: 1px solid var(--b20-border);
    border-radius: 8px;
    padding: 6px 8px;
  }

  .b20-add-btn {
    padding: 7px 14px;
    border-radius: 8px;
    border: none;
    background: var(--b20-accent);
    color: #fff;
    font-weight: 600;
    font-size: 12.5px;
    cursor: pointer;
  }

  .b20-hotkey-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .b20-hotkey-list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    border-radius: 8px;
    background: var(--b20-surface-subtle);
  }

  kbd {
    padding: 2px 8px;
    border-radius: 6px;
    background: var(--b20-surface);
    border: 1px solid var(--b20-border);
    font-size: 12px;
    font-weight: 700;
  }

  .b20-del {
    background: transparent;
    border: none;
    color: var(--b20-error);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .b20-empty {
    margin: 0;
    font-size: 12.5px;
    color: var(--b20-text-muted);
    text-align: center;
    padding: 12px 0;
  }
</style>
