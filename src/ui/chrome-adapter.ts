import schemaData from "./schema-data.json";
import type { CharacterInfo, OptionDef, PreviewContext, SettingsMap, TabInfo } from "./types";

export const OPTIONS_LIST = schemaData.options_list as unknown as Record<string, OptionDef>;
export const CHARACTER_SETTINGS = schemaData.character_settings as unknown as Record<string, OptionDef>;

const STORAGE_PREFIX = "b20_preview_";

const MOCK_TABS: Record<PreviewContext, TabInfo> = {
  character: {
    id: 101,
    title: "Aria Stormwind - D&D Beyond",
    url: "https://www.dndbeyond.com/characters/12345678"
  },
  monster: {
    id: 102,
    title: "Adult Red Dragon - Monsters - D&D Beyond",
    url: "https://www.dndbeyond.com/monsters/16771-adult-red-dragon"
  },
  roll20: {
    id: 103,
    title: "Curse of Strahd | Roll20",
    url: "https://app.roll20.net/editor/"
  },
  fvtt: {
    id: 104,
    title: "Foundry Virtual Tabletop",
    url: "https://mygame.forge-vtt.com/game"
  },
  default: {
    id: 105,
    title: "Example Page",
    url: "https://example.com/"
  }
};

const MOCK_CHARACTER: CharacterInfo = {
  id: "12345678",
  name: "Aria Stormwind",
  classes: { Rogue: 5, Paladin: 3 },
  "class-features": ["Sneak Attack 2024", "Cunning Strike", "Divine Smite", "Jack of All Trades"],
  "racial-traits": ["Lucky"],
  feats: ["Great Weapon Master", "Sharpshooter"]
};

function hasChromeExtension(): boolean {
  return typeof chrome !== "undefined" && !!chrome.storage?.local;
}

function getPreviewContext(): PreviewContext {
  const ctx = new URLSearchParams(window.location.search).get("context") as PreviewContext | null;
  return ctx && ctx in MOCK_TABS ? ctx : "character";
}

export function getDefaults(schema: Record<string, OptionDef>): SettingsMap {
  const defaults: SettingsMap = {};
  for (const [key, def] of Object.entries(schema)) {
    if ("default" in def) {
      defaults[key] = def.default;
    }
  }
  return defaults;
}

export function getAssetUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
    return chrome.runtime.getURL(clean);
  }
  return `/${clean}`;
}

export async function loadStoredSettings(
  key = "settings",
  schema: Record<string, OptionDef> = OPTIONS_LIST
): Promise<SettingsMap> {
  const defaults = getDefaults(schema);
  if (hasChromeExtension()) {
    return new Promise((resolve) => {
      chrome.storage!.local.get({ [key]: defaults }, (items) => {
        resolve({ ...defaults, ...(items[key] as SettingsMap) });
      });
    });
  }
  const raw = localStorage.getItem(STORAGE_PREFIX + key);
  if (!raw) return defaults;
  try {
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
}

export async function saveStoredSettings(
  settings: SettingsMap,
  key = "settings",
  type: "general" | "character" = "general",
  characterId?: string
): Promise<void> {
  if (hasChromeExtension()) {
    await new Promise<void>((resolve) => {
      chrome.storage!.local.set({ [key]: settings }, () => resolve());
    });
    chrome.runtime?.sendMessage?.(
      type === "character" && characterId
        ? { action: "settings", type: "character", id: characterId, settings }
        : { action: "settings", type: "general", settings }
    );
    return;
  }
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(settings));
}

export async function getActiveTab(): Promise<TabInfo> {
  if (typeof chrome !== "undefined" && chrome.tabs?.query) {
    return new Promise((resolve) => {
      chrome.tabs!.query({ active: true, currentWindow: true }, (tabs) => {
        resolve((tabs[0] as TabInfo) || MOCK_TABS.default);
      });
    });
  }
  if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
    return new Promise((resolve) => {
      chrome.runtime!.sendMessage!({ action: "get-current-tab" }, (tab) => {
        resolve((tab as TabInfo) || MOCK_TABS[getPreviewContext()]);
      });
    });
  }
  return MOCK_TABS[getPreviewContext()];
}

export async function getCharacterFromTab(tabId: number): Promise<CharacterInfo | null> {
  if (typeof chrome !== "undefined" && chrome.tabs?.sendMessage) {
    return new Promise((resolve) => {
      chrome.tabs!.sendMessage(tabId, { action: "get-character" }, { frameId: 0 }, (res) => {
        resolve((res as CharacterInfo) || null);
      });
    });
  }
  if (typeof chrome !== "undefined" && chrome.runtime?.sendMessage) {
    return new Promise((resolve) => {
      chrome.runtime!.sendMessage!(
        { action: "forward", tab: tabId, message: { action: "get-character" } },
        (res) => resolve((res as CharacterInfo) || null)
      );
    });
  }
  if (getPreviewContext() === "character") {
    const saved = await loadStoredSettings("character-" + MOCK_CHARACTER.id, CHARACTER_SETTINGS);
    return { ...MOCK_CHARACTER, settings: saved };
  }
  return null;
}

export async function getOpenVttTabs(): Promise<TabInfo[]> {
  if (typeof chrome !== "undefined" && chrome.tabs?.query) {
    return new Promise((resolve) => {
      chrome.tabs!.query({}, (tabs) => resolve(tabs as TabInfo[]));
    });
  }
  return [MOCK_TABS.roll20, MOCK_TABS.fvtt];
}

export function openOptionsPage(): void {
  if (typeof chrome !== "undefined" && chrome.runtime?.openOptionsPage) {
    chrome.runtime.openOptionsPage();
    return;
  }
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: "b20-preview-open-options" }, "*");
  } else {
    window.open("/src/ui/options.html", "_blank");
  }
}

export type ToolWindowKind = "restore" | "discord" | "domains";

export function openToolWindow(tool: ToolWindowKind, vtt: string = "dndbeyond"): void {
  const query = `tool=${tool}&vtt=${encodeURIComponent(vtt)}`;
  const url =
    typeof chrome !== "undefined" && chrome.runtime?.getURL
      ? chrome.runtime.getURL(`tool.html?${query}`)
      : `/src/ui/tool.html?${query}`;

  if (typeof chrome !== "undefined" && chrome.windows?.create) {
    chrome.windows.create({ url, type: "popup", width: 480, height: 480 });
    return;
  }
  window.open(url, `b20-tool-${tool}`, "width=480,height=480,resizable=yes");
}

export type ColorScheme = "auto" | "light" | "dark";
const COLOR_SCHEME_KEY = "b20-color-scheme";

export async function loadColorScheme(): Promise<ColorScheme> {
  if (hasChromeExtension()) {
    return new Promise((resolve) => {
      chrome.storage!.local.get({ [COLOR_SCHEME_KEY]: "auto" }, (items) => {
        const val = items[COLOR_SCHEME_KEY];
        resolve(val === "light" || val === "dark" ? val : "auto");
      });
    });
  }
  const raw = localStorage.getItem(STORAGE_PREFIX + COLOR_SCHEME_KEY);
  return raw === "light" || raw === "dark" ? raw : "auto";
}

export async function saveColorScheme(scheme: ColorScheme): Promise<void> {
  if (hasChromeExtension()) {
    await new Promise<void>((resolve) => {
      chrome.storage!.local.set({ [COLOR_SCHEME_KEY]: scheme }, () => resolve());
    });
    return;
  }
  localStorage.setItem(STORAGE_PREFIX + COLOR_SCHEME_KEY, scheme);
}

export function resetPreviewStorage(): void {
  for (const k of Object.keys(localStorage)) {
    if (k.startsWith(STORAGE_PREFIX)) {
      localStorage.removeItem(k);
    }
  }
}
