<script lang="ts">
  import { getAssetUrl, openOptionsPage } from "./chrome-adapter";
</script>

<div class="b20-shell" data-vtt="default">
  <header class="b20-header">
    <div class="b20-brand">
      <img src={getAssetUrl("images/icons/icon32.png")} alt="Beyond20" class="b20-logo" />
      <span class="b20-title">Beyond20</span>
      <span class="b20-badge">Standby</span>
    </div>
  </header>

  <main class="b20-main">
    <ul class="b20-list">
      <li class="b20-card b20-card--info">
        <h4>Not a D&amp;D Beyond or VTT page</h4>
        <p>Beyond20 activates automatically on D&amp;D Beyond, Roll20, and Foundry VTT pages.</p>
      </li>

      <li class="b20-card">
        <a href="https://beyond20.here-for-more.info/support" target="_blank" rel="noopener noreferrer">
          <div>
            <h4>Donate</h4>
            <p>Support Beyond20 development</p>
          </div>
          <img src={getAssetUrl("images/donate32.png")} width="32" height="32" alt="Donate" />
        </a>
      </li>

      <li class="b20-card">
        <button type="button" onclick={openOptionsPage}>
          <div>
            <h4>Beyond20 Options</h4>
            <p>Configure Beyond20's global settings</p>
          </div>
          <span aria-hidden="true">→</span>
        </button>
      </li>
    </ul>
  </main>
</div>

<style>
  .b20-shell {
    min-width: 400px;
    max-width: 460px;
  }

  .b20-header {
    display: flex;
    align-items: center;
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

  .b20-badge {
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 600;
    border-radius: 999px;
    background: var(--b20-surface-subtle);
    color: var(--b20-text-muted);
  }

  .b20-main {
    padding: 12px 14px 18px;
  }

  .b20-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .b20-card {
    background: var(--b20-surface);
    border: 1px solid var(--b20-border);
    border-radius: var(--b20-radius);
  }

  .b20-card--info {
    background: var(--b20-info-bg);
    border-color: var(--b20-info-border);
    padding: 12px 14px;
    color: var(--b20-info-text);
  }

  .b20-card a,
  .b20-card button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    background: transparent;
    border: none;
    color: inherit;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
    font-family: inherit;
  }

  h4 {
    margin: 0;
    font-size: 13.5px;
    font-weight: 600;
  }

  p {
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--b20-text-muted);
  }

  .b20-card--info p {
    color: var(--b20-info-text);
  }
</style>
