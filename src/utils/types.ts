// Global
export type GlobalSettings = {
  global: boolean;
  urls: string[];
  needsRefresh: boolean;
};

// Snippets
export type UserSnippet = {
  author: string;
  name: string;
  description: string;
  url: string;
  toggle: boolean;
};
export type SnippetData = {
  toggle: boolean;
};
export type SnippetInfo = {
  name: string;
  description: string;
  order: number;
};
export type PopulatedSnippet = {
  id: string;
} & SnippetInfo &
  SnippetData;
export type SnippetSettings = {
  toggle: boolean;
  snippets: Record<string, SnippetData>;
  user: Record<string, UserSnippet>;
};

// Themes
export type LogoDetails = {
  name: string;
  url: string;
  id: string;
  disable?: boolean; // whether the icon should be injected or not
  adaptive?: boolean; // whether the icon should follow the accent colour
};
type Theme = "catppuccin";
export type ThemeSettings = {
  toggle: boolean;
  theme: Theme;
  flavour: string;
  accent: string;
  logo: LogoDetails;
};

// Plugins
export type PluginData = {
  toggle: boolean;
  settings?: Record<string, any>;
};
export type PluginInfo = {
  name: string;
  description: string;
  order: number;
};
export type PopulatedPlugin = {
  id: string;
} & PluginInfo &
  PluginData;
export type PluginSettings = {
  toggle: boolean;
  plugins: Record<string, PluginData>;
};
