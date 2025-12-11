import type { snippetConfig } from "./snippets";
import type { StorageState } from "./state.svelte";

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

// common for plugins and snippets
export interface ItemInfo {
  name: string;
  description: string;
}

// plugins
export type Toggle = { toggle: boolean };

export type Slider = {
  value: number;
  min: number;
  max: number;
};

// snippets
export type SnippetId = keyof typeof snippetConfig;

export type SnippetData = {
  toggle: StorageState<Toggle>;
} & ItemInfo;

export type SnippetConfig = {
  default: boolean;
} & ItemInfo;
