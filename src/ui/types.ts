export type OptionType = "bool" | "string" | "combobox" | "link" | "info" | "special" | "migrate";

export interface OptionDef {
  title?: string;
  short?: string;
  description?: string;
  short_description?: string;
  type: OptionType;
  default?: unknown;
  choices?: Record<string, string>;
  advanced?: boolean;
  hidden?: boolean;
  lock?: string;
  icon?: string;
  "icon-width"?: number | string;
  "icon-height"?: number | string;
}

export type SettingsMap = Record<string, unknown>;

export interface CharacterInfo {
  id: string;
  name: string;
  classes: Record<string, number>;
  "class-features": string[];
  "racial-traits": string[];
  feats: string[];
  settings?: SettingsMap;
}

export interface TabInfo {
  id: number;
  title: string;
  url: string;
}

export type PreviewContext = "character" | "monster" | "roll20" | "fvtt" | "default";

export type ToastKind = "success" | "info" | "warning" | "error";

export interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}
