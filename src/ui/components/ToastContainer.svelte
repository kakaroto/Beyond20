<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { toasts } from "../stores/toasts.svelte";
</script>

<div class="b20-toast-stack" aria-live="polite">
  {#each toasts.items as toast (toast.id)}
    <div
      class="b20-toast b20-toast--{toast.kind}"
      in:fly={{ y: 14, duration: 200 }}
      out:fade={{ duration: 150 }}
      animate:flip={{ duration: 200 }}
      role="status"
    >
      <span class="b20-toast-dot" aria-hidden="true"></span>
      <span class="b20-toast-msg">{toast.message}</span>
      <button
        type="button"
        class="b20-toast-close"
        aria-label="Dismiss notification"
        onclick={() => toasts.dismiss(toast.id)}
      >
        ×
      </button>
    </div>
  {/each}
</div>

<style>
  .b20-toast-stack {
    position: fixed;
    bottom: 14px;
    right: 14px;
    left: 14px;
    z-index: 9000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    pointer-events: none;
  }

  .b20-toast {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 340px;
    padding: 9px 12px;
    border-radius: 10px;
    background: var(--b20-surface);
    color: var(--b20-text);
    border: 1px solid var(--b20-border);
    box-shadow: var(--b20-shadow-md);
    font-size: 12.5px;
    font-weight: 500;
  }

  .b20-toast-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    background: var(--b20-accent);
  }

  .b20-toast--success .b20-toast-dot { background: var(--b20-success); }
  .b20-toast--warning .b20-toast-dot { background: var(--b20-warn); }
  .b20-toast--error .b20-toast-dot { background: var(--b20-error); }

  .b20-toast-msg {
    flex: 1;
  }

  .b20-toast-close {
    background: transparent;
    border: none;
    color: var(--b20-text-muted);
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    padding: 0 2px;
  }

  .b20-toast-close:hover {
    color: var(--b20-text);
  }
</style>
