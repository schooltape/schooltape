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

export type Toggle = { toggle: boolean };

export type Slider = {
  value: number;
  min: number;
  max: number;
};

export type Plugin = {
  toggle: StorageState<Toggle>;
  settings?: Record<string, PluginSetting>;
} & ItemInfo;

export type PluginConfig = {
  default: boolean;
  settings?: Record<string, PluginSettingConfig>;
} & ItemInfo;

export type PluginSetting =
  | ({
      type: "toggle";
      state: StorageState<Toggle>;
    } & ItemInfo)
  | ({
      type: "slider";
      state: StorageState<Slider>;
    } & ItemInfo);

export type PluginSettingConfig =
  | ({
      type: "toggle";
      default: Toggle;
    } & ItemInfo)
  | ({
      type: "slider";
      default: Slider;
    } & ItemInfo);

// Snippets
export type SnippetId = "roundedCorners" | "hidePfp" | "hidePwaPrompt" | "censor";

export type Snippet = {
  toggle: StorageState<Toggle>;
} & ItemInfo;

export type SnippetConfig = {
  default: boolean;
} & ItemInfo;
