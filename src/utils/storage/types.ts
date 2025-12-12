// global
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

export type Toggle = { toggle: boolean };

export type Slider = {
  value: number;
  min: number;
  max: number;
};
