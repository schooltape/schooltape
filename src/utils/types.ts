// Global
export type GlobalSettings = {
  global: boolean;
  updates: {
    available: boolean;
    desktop: boolean;
  };
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
export type Snippet = {
  name: string;
  description: string;
  toggle: boolean;
};
export type SnippetSettings = {
  toggle: boolean;
  snippets: Record<string, Snippet>;
  snippetOrder: string[];
  user: Record<string, UserSnippet>;
};

// Themes
export type LogoDetails = {
  name: string;
  url: string;
  id: string;
  disable?: boolean; // whether the icon should be injected or not
};
export type ThemeSettings = {
  toggle: boolean;
  theme: string;
  flavour: string;
  accent: string;
  logo: LogoDetails;
};

// Plugins
export type Plugin = {
  toggle: boolean;
  name: string;
  description: string;
  settings?: Record<string, any>;
};
export type PluginSettings = {
  toggle: boolean;
  plugins: Record<string, Plugin>;
  pluginOrder: string[];
};
