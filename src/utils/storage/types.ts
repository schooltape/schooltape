import { StorageState } from "./state.svelte";

// Global
export interface Settings {
  global: boolean;
  plugins: boolean;
  themes: boolean;
  snippets: boolean;

  themeFlavour: string;
  themeAccent: string;
  themeLogo: LogoId;
  themeLogoAsFavicon: boolean;

  userSnippets: Record<string, UserSnippet>;
}

export interface UpdatedBadges {
  icon: boolean;
  changelog: boolean;
}

export interface Motd {
  motd: string;
}

export interface SchoolboxUrls {
  urls: string[];
}

export type LogoId = "default" | "catppuccin" | "schoolbox" | "schooltape" | "schooltape-rainbow" | "schooltape-legacy";

export interface LogoInfo {
  name: string;
  url: string;
  disable?: boolean; // whether the icon should be injected or not
  adaptive?: boolean; // whether the icon should follow the accent colour
}

export interface UserSnippet {
  author: string;
  name: string;
  description: string;
  url: string;
  toggle: boolean;
}

// Common for plugins and snippets
export interface ItemInfo {
  name: string;
  description: string;
}

// Plugins
export type PluginId =
  | "subheader"
  | "scrollSegments"
  | "scrollPeriod"
  | "progressBar"
  | "modernIcons"
  | "tabTitle"
  | "homepageSwitcher";

export type ToggleState = { toggle: boolean };
type Toggle = {
  type: "toggle";
  state: StorageState<ToggleState>;
  info: ItemInfo;
};

export type SliderState = {
  value: number;
  min: number;
  max: number;
};
type Slider = {
  type: "slider";
  state: StorageState<SliderState>;
  info: ItemInfo;
};
export type PluginSetting = Toggle | Slider;

export type PluginData = {
  toggle: StorageState<ToggleState>;
  info: ItemInfo;
  settings?: Record<string, PluginSetting>;
};

// Snippets
export type SnippetId = "roundedCorners" | "hidePfp" | "hidePwaPrompt" | "censor";

export type SnippetData = {
  toggle: StorageState<ToggleState>;
  info: ItemInfo;
};
