// global
export interface SettingsV1 {
  global: boolean;
  plugins: boolean;
  themes: boolean;
  snippets: boolean;

  themeFlavour: Flavour;
  themeAccent: Accent;
  themeLogo: "default" | "schooltape" | "schooltape-rainbow" | "schooltape-legacy" | "catppuccin" | "schoolbox";
  themeLogoAsFavicon: boolean;

  userSnippets: Record<string, UserSnippet>;
}

export interface SettingsV2 {
  global: boolean;
  plugins: boolean;
  themes: boolean;
  snippets: boolean;

  themeFlavour: Flavour;
  themeAccent: Accent;

  userSnippets: Record<string, UserSnippet>;
}

export type Flavour = "latte" | "frappe" | "macchiato" | "mocha";
export type Accent =
  | "rosewater"
  | "flamingo"
  | "pink"
  | "mauve"
  | "red"
  | "maroon"
  | "peach"
  | "yellow"
  | "green"
  | "teal"
  | "sky"
  | "sapphire"
  | "blue"
  | "lavender";

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
