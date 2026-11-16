<script module lang="ts">
  let closeActiveDropdown: (() => void) | null = null;
</script>

<script lang="ts">
  import { fly } from "svelte/transition";

  export interface SelectOption {
    value: string;
    label: string;
  }

  interface Props {
    id?: string;
    value: string;
    options: SelectOption[];
    placeholder?: string;
    onChange: (value: string) => void;
  }

  let { id, value, options, placeholder = "Select…", onChange }: Props = $props();

  let open = $state(false);
  let containerEl = $state<HTMLDivElement | null>(null);

  const selectedLabel = $derived(
    options.find((o) => o.value === value)?.label ?? placeholder
  );

  function closeSelf() {
    open = false;
    if (closeActiveDropdown === closeSelf) {
      closeActiveDropdown = null;
    }
  }

  function toggleOpen() {
    if (open) {
      closeSelf();
    } else {
      if (closeActiveDropdown && closeActiveDropdown !== closeSelf) {
        closeActiveDropdown();
      }
      open = true;
      closeActiveDropdown = closeSelf;
    }
  }

  function choose(val: string) {
    closeSelf();
    if (val !== value) {
      onChange(val);
    }
  }

  function handleWindowClick(e: MouseEvent) {
    if (open && containerEl && !containerEl.contains(e.target as Node)) {
      closeSelf();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && open) {
      e.preventDefault();
      closeSelf();
    }
  }
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleKeydown} />

<div class="b20-dropdown" class:is-open={open} bind:this={containerEl}>
  <button
    {id}
    type="button"
    class="b20-dropdown-trigger"
    aria-haspopup="listbox"
    aria-expanded={open}
    onclick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleOpen();
    }}
  >
    <span class="b20-dropdown-label">{selectedLabel}</span>
    <svg
      class="b20-dropdown-chevron"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.4"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </button>

  {#if open}
    <ul
      class="b20-dropdown-menu"
      role="listbox"
      transition:fly={{ y: -4, duration: 140 }}
    >
      {#each options as opt (opt.value)}
        {@const active = opt.value === value}
        <li role="option" aria-selected={active}>
          <button
            type="button"
            class="b20-dropdown-item"
            class:active
            onclick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              choose(opt.value);
            }}
          >
            <span>{opt.label}</span>
            {#if active}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .b20-dropdown {
    position: relative;
    min-width: 170px;
    max-width: 230px;
  }

  .b20-dropdown.is-open {
    z-index: 300;
  }

  .b20-dropdown-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 6px 10px;
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--b20-text);
    background: var(--b20-surface-subtle);
    border: 1px solid var(--b20-border);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  }

  .b20-dropdown-trigger:hover {
    border-color: var(--b20-accent);
  }

  .b20-dropdown.is-open .b20-dropdown-trigger,
  .b20-dropdown-trigger:focus-visible {
    outline: none;
    border-color: var(--b20-accent);
    box-shadow: 0 0 0 3px var(--b20-accent-soft);
  }

  .b20-dropdown-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .b20-dropdown-chevron {
    flex-shrink: 0;
    color: var(--b20-text-muted);
    transition: transform 0.18s ease;
  }

  .b20-dropdown.is-open .b20-dropdown-chevron {
    transform: rotate(180deg);
    color: var(--b20-accent);
  }

  .b20-dropdown-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 5px);
    min-width: 100%;
    width: max-content;
    max-width: 240px;
    max-height: 220px;
    overflow-y: auto;
    list-style: none;
    margin: 0;
    padding: 4px;
    background: var(--b20-surface);
    border: 1px solid var(--b20-border);
    border-radius: 10px;
    box-shadow: var(--b20-shadow-md);
    z-index: 301;
  }

  .b20-dropdown-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 7px 10px;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: var(--b20-text);
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.12s ease, color 0.12s ease;
  }

  .b20-dropdown-item:hover {
    background: var(--b20-surface-subtle);
  }

  .b20-dropdown-item.active {
    background: var(--b20-accent-soft);
    color: var(--b20-accent);
    font-weight: 600;
  }
</style>
