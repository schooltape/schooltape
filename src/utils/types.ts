// Global
export interface Settings {
  global: boolean;
  plugins: boolean;
  themes: boolean;
  snippets: boolean;

  themeFlavour: string;
  themeAccent: string;
  themeLogo: LogoId;

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

// Plugins
export type PluginId =
  | "subheader"
  | "scrollSegments"
  | "scrollPeriod"
  | "modernIcons"
  | "tabTitle"
  | "homepageSwitcher"
  | "timetableLabels"
  | "legacyTimetable";

export interface PluginInfo {
  name: string;
  description: string;
}

export interface PluginGeneric {
  toggle: boolean;
  // extend this type for plugin-specific settings
}

export interface TabTitle extends PluginGeneric {
  showSubjectPrefix: boolean;
}

// Snippets
export type SnippetId = "hidePfp" | "censor";

export interface SnippetInfo {
  name: string;
  description: string;
}

export interface SnippetGeneric {
  toggle: boolean;
  // extend this type for snippet-specific settings
}
