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
export interface ItemGeneric {
  toggle: boolean;
}
export interface ItemInfo {
  name: string;
  description: string;
}
export type ItemId = PluginId | SnippetId;
export interface PopulatedItem<T> extends ItemGeneric, ItemInfo {
  id: T;
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

type ToggleData = {
  toggle: StorageState<ToggleSetting>;
  info: ItemInfo;
};
type SliderData = {
  slider: StorageState<SliderSetting>;
  info: ItemInfo;
};

export type PluginData = {
  toggle: StorageState<ToggleSetting>;
  info: ItemInfo;
  settings?: {
    toggle?: Record<string, ToggleData>;
    slider?: Record<string, SliderData>;
  };
};

// Snippets
export type SnippetId = "hidePfp" | "hidePwaPrompt" | "censor";

export type SnippetData = {
  toggle: StorageState<ToggleSetting>;
  info: ItemInfo;
};

export interface ToggleSetting {
  toggle: boolean;
}
export interface SliderSetting {
  min: number;
  max: number;
  value: number;
}
