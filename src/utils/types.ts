// === Global ===
// settings for plugins and in-built snippets are stored in individual WXT storage items
export type Settings = {
  global: boolean;
  plugins: boolean;
  themes: boolean;
  snippets: boolean;

  themeFlavour: string;
  themeAccent: string;
  themeLogo: LogoDetails;

  userSnippets: Record<string, UserSnippet>;

  // Schoolbox URLs
  urls: string[];

  // whether the settings require a refresh
  needsRefresh: boolean;
};

// === Themes ===
export type LogoDetails = {
  name: string;
  url: string;
  id: string;
  disable?: boolean; // whether the icon should be injected or not
  adaptive?: boolean; // whether the icon should follow the accent colour
};

// === Plugins ===
export type Plugin = {
  id: PluginId;
  toggle: boolean;
  // extend this type for plugin-specific settings
};

export type PluginId =
  | "subheader"
  | "scrollSegments"
  | "scrollPeriod"
  | "modernIcons"
  | "tabTitle"
  | "homepageSwitcher"
  | "timetableLabels"
  | "legacyTimetable";

// hardcoded, see constants.ts (can probably be moved there)
export type PluginInfo = {
  name: string;
  description: string;
  order: number;
};

// we can move this over to the relevant svelte file, it doesn't need to be in here
// export type PopulatedPlugin = {
//   id: string;
// } & PluginInfo &
//   PluginData;

// === Snippets ===
export type Snippet = {
  id: SnippetId;
  toggle: boolean;
  // extend this type for snippet-specific settings
};

export type UserSnippet = {
  author: string;
  name: string;
  description: string;
  url: string;
  toggle: boolean;
};

export type SnippetId = "hidePfp" | "censor";

// hardcoded, see constants.ts (can probably be moved there)
export type SnippetInfo = {
  name: string;
  description: string;
  order: number;
};
// we can move this over to the relevant svelte file, it doesn't need to be in here
// export type PopulatedSnippet = {
//   id: string;
// } & SnippetInfo &
//   SnippetData;
