export type ScriptV1 = {
  execute: string;
  path: string;
};

export type PluginDataV1 = {
  name: string;
  description: string;
  scripts: ScriptV1[]; // This denotes an array of any length
};

export type PopulatedPluginV1 = {
  id: string;
  name: string;
  description: string;
  toggle: boolean;
};

export type SnippetDataV1 = {
  name: string;
  description: string;
  path: string;
};

export type PopulatedSnippetV1 = {
  id: string;
  name: string;
  description: string;
  path: string;
  toggle: boolean;
};

export type ExtensionStorageSchema = GlobalSettingsV1 & {
  snippets: SnippetSettingsV1;
  plugins: PluginSettingsV1;
  themes: ThemeSettingsV1;
};

export type GlobalSettingsV1 = {
  global: boolean;
  updates: {
    available: boolean;
    toast: boolean;
    desktop: boolean;
    [key: string]: boolean;
  };
  urls: string[];
};
export const globalSettings = storage.defineItem<GlobalSettingsV1>("local:globalSettings", {
  version: 1,
  defaultValue: {
    global: true,
    updates: {
      available: false,
      toast: true,
      desktop: false,
    },
    urls: ["https://help.schoolbox.com.au"],
  },
});

export type SnippetSettingsV1 = {
  toggle: boolean;
  enabled: string[];
  user: Record<string, UserSnippetSchema>;
};
export type UserSnippetSchema = {
  author: string;
  name: string;
  description: string;
  url: string;
  toggle: boolean;
};
export const snippetSettings = storage.defineItem<SnippetSettingsV1>("local:snippetSettings", {
  version: 1,
  defaultValue: {
    toggle: true,
    enabled: ["hide-pfp"],
    user: {},
  },
});

export type PluginSettingsV1 = {
  toggle: boolean;
  enabled: string[];
  settings: Record<string, any>;
};
export const pluginSettings = storage.defineItem<PluginSettingsV1>("local:pluginSettings", {
  version: 1,
  defaultValue: {
    toggle: true,
    enabled: ["subheader", "scroll-segments", "tab-title", "scroll-period", "timetable-labels"],
    settings: {},
  },
});

export type LogoDetailsV1 = {
  name: string;
  url: string;
  id: string;
  disable?: boolean; // whether the icon should be injected or not
};
export type ThemeSettingsV1 = {
  toggle: boolean;
  theme: string;
  flavour: string;
  accent: string;
  logo: LogoDetailsV1;
};
export const themeSettings = storage.defineItem<ThemeSettingsV1>("local:themeSettings", {
  version: 1,
  defaultValue: {
    toggle: true,
    theme: "catppuccin",
    flavour: "macchiato",
    accent: "rosewater",
    logo: {
      name: "ST Rainbow",
      id: "st-rainbow",
      url: "https://schooltape.github.io/schooltape-ctp.svg",
    },
  },
});
