<script lang="ts">
  import CustomSelect from "./CustomSelect.svelte";
  import { getAssetUrl } from "../chrome-adapter";
  import type { OptionDef } from "../types";

  interface Props {
    name: string;
    option: OptionDef;
    short?: boolean;
    value: unknown;
    lockValue?: boolean;
    onChange: (name: string, value: unknown) => void;
    onLockChange?: (lockName: string, locked: boolean) => void;
  }

  let {
    name,
    option,
    short = false,
    value,
    lockValue = false,
    onChange,
    onLockChange
  }: Props = $props();

  const label = $derived(short && option.short ? option.short : option.title || name);
  const description = $derived(
    short && option.short_description !== undefined
      ? option.short_description
      : option.description || ""
  );
  const selectOptions = $derived(
    option.choices
      ? Object.entries(option.choices).map(([value, text]) => ({ value, label: text }))
      : []
  );
</script>

{#if option.type === "info"}
  <li class="b20-card b20-card--info">
    <div class="b20-card-body">
      <div class="b20-info">
        <h4>{label}</h4>
        {#if description}<p>{description}</p>{/if}
      </div>
    </div>
  </li>
{:else if option.type === "link"}
  <li class="b20-card">
    <a
      class="b20-card-body b20-card-link"
      href={String(option.default || "#")}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div class="b20-info">
        <h4>{label}</h4>
        {#if description}<p>{description}</p>{/if}
      </div>
      {#if option.icon}
        <img
          src={option.icon.startsWith("/") ? getAssetUrl(option.icon) : option.icon}
          width={option["icon-width"] || 32}
          height={option["icon-height"] || 32}
          alt={label}
          class="b20-link-img"
        />
      {/if}
    </a>
  </li>
{:else}
  <li class="b20-card">
    <label class="b20-card-body" for={name}>
      <div class="b20-info">
        <h4>{label}</h4>
        {#if description}<p>{description}</p>{/if}
      </div>

      <div class="b20-controls">
        {#if option.lock && onLockChange}
          <label class="b20-padlock" title="Lock setting">
            <input
              type="checkbox"
              checked={Boolean(lockValue)}
              onchange={(e) => onLockChange(option.lock!, e.currentTarget.checked)}
            />
            <span class="b20-padlock-icon" aria-hidden="true"></span>
          </label>
        {/if}

        {#if option.type === "bool"}
          <span class="b20-switch">
            <input
              id={name}
              type="checkbox"
              checked={Boolean(value)}
              onchange={(e) => onChange(name, e.currentTarget.checked)}
            />
            <span class="b20-slider" aria-hidden="true"></span>
          </span>
        {:else if option.type === "string"}
          <input
            id={name}
            type="text"
            class="b20-input"
            value={String(value ?? "")}
            onchange={(e) => onChange(name, e.currentTarget.value)}
          />
        {:else if option.type === "combobox"}
          <CustomSelect
            id={name}
            value={String(value ?? option.default ?? "")}
            options={selectOptions}
            onChange={(val) => onChange(name, val)}
          />
        {/if}
      </div>
    </label>
  </li>
{/if}

<style>
  .b20-card {
    background: var(--b20-surface);
    border: 1px solid var(--b20-border);
    border-radius: var(--b20-radius);
    box-shadow: var(--b20-shadow-sm);
    transition: border-color 0.15s ease, background-color 0.15s ease, transform 0.1s ease;
  }

  .b20-card:hover {
    background: var(--b20-surface-hover);
    border-color: color-mix(in srgb, var(--b20-border) 55%, var(--b20-accent));
  }

  .b20-card--info {
    background: var(--b20-info-bg);
    border-color: var(--b20-info-border);
  }

  .b20-card--info:hover {
    background: var(--b20-info-bg);
  }

  .b20-card--info h4,
  .b20-card--info p {
    color: var(--b20-info-text);
  }

  .b20-card-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 11px 14px;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

  .b20-info {
    flex: 1;
    min-width: 0;
  }

  h4 {
    margin: 0;
    font-size: 13.5px;
    font-weight: 600;
    color: var(--b20-text);
  }

  p {
    margin: 2px 0 0;
    font-size: 12px;
    line-height: 1.4;
    color: var(--b20-text-muted);
    white-space: pre-line;
  }

  .b20-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .b20-link-img {
    border-radius: 6px;
  }

  .b20-switch {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .b20-switch input {
    position: absolute;
    opacity: 0;
    width: 40px;
    height: 22px;
    margin: 0;
    cursor: pointer;
  }

  .b20-slider {
    width: 40px;
    height: 22px;
    border-radius: 999px;
    background: var(--b20-switch-off);
    position: relative;
    transition: background-color 0.2s ease;
  }

  .b20-slider::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .b20-switch input:checked + .b20-slider {
    background: var(--b20-accent);
  }

  .b20-switch input:checked + .b20-slider::after {
    transform: translateX(18px);
  }

  .b20-switch input:focus-visible + .b20-slider {
    outline: 2px solid var(--b20-accent);
    outline-offset: 2px;
  }

  .b20-padlock {
    position: relative;
    display: inline-flex;
    cursor: pointer;
  }

  .b20-padlock input {
    position: absolute;
    opacity: 0;
    width: 24px;
    height: 24px;
    margin: 0;
  }

  .b20-padlock-icon {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--b20-surface-subtle);
    color: var(--b20-text-muted);
    transition: all 0.15s ease;
  }

  .b20-padlock-icon::before {
    content: "";
    width: 13px;
    height: 13px;
    background: currentColor;
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 9.9-1'/%3E%3C/svg%3E") center / contain no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 9.9-1'/%3E%3C/svg%3E") center / contain no-repeat;
  }

  .b20-padlock input:checked + .b20-padlock-icon {
    background: var(--b20-accent-soft);
    color: var(--b20-accent);
  }

  .b20-padlock input:checked + .b20-padlock-icon::before {
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E") center / contain no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2'/%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'/%3E%3C/svg%3E") center / contain no-repeat;
  }

  .b20-input,
  .b20-select {
    font-family: inherit;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--b20-text);
    background: var(--b20-surface-subtle);
    border: 1px solid var(--b20-border);
    border-radius: 8px;
    padding: 6px 10px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .b20-input {
    width: 140px;
  }

  .b20-select {
    max-width: 180px;
    cursor: pointer;
  }

  .b20-input:focus,
  .b20-select:focus {
    border-color: var(--b20-accent);
    box-shadow: 0 0 0 3px var(--b20-accent-soft);
  }
</style>
