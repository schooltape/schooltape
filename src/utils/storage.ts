// const defaultSettings = {
//   settings: {
//     global: true,
//     updates: {
//       toast: true,
//       desktop: false,
//     },
//     urls: ["https://help.schoolbox.com.au"],
//   },
//   snippets: {
//     toggle: true,
//     enabled: ["hide-pfp"],
//     user: {},
//   },
//   plugins: {
//     toggle: true,
//     enabled: ["subheader", "scroll-segments", "tab-title", "scroll-period", "timetable-labels"],
//     settings: {},
//   },
//   themes: {
//     toggle: true,
//     theme: "catppuccin",
//     flavour: "macchiato",
//     accent: "rosewater",
//     logo: "schooltape.png",
//   },
// };

export interface Script {
  execute: string;
  path: string;
}
export interface PluginData {
  name: string;
  description: string;
  scripts: Script[]; // This denotes an array of any length
}
export type PopulatedPluginV1 = {
  id: string;
  name: string;
  description: string;
  toggle: boolean;
}

export type ExtensionStorageSchema = GlobalSettingsV1 & {
  snippets: SnippetSettingsV1;
  plugins: PluginSettingsV1;
  themes: ThemeSettingsV1;
}

export type GlobalSettingsV1 = {
  global: boolean;
  updates: {
    toast: boolean;
    desktop: boolean;
    [key: string]: boolean;
  };
  urls: string[];
}
export const globalSettings = storage.defineItem<GlobalSettingsV1>(
  'local:globalSettings',
  {
    version: 1,
    defaultValue: {
      global: true,
      updates: {
        toast: true,
        desktop: false,
      },
      urls: ["https://help.schoolbox.com.au"],
    },
  }
);

export type SnippetSettingsV1 = {
  toggle: boolean;
  enabled: string[];
  user: Record<string, UserSnippetSchema>;
}
export type UserSnippetSchema = {
  id: string;
  name: string;
  description: string;
  path: string;
  toggled: boolean;
}
export const snippetSettings = storage.defineItem<SnippetSettingsV1>(
  'local:snippetSettings',
  {
    version: 1,
    defaultValue: {
      toggle: true,
      enabled: ["hide-pfp"],
      user: {},
    },
  }
);

export type PluginSettingsV1 = {
  toggle: boolean;
  enabled: string[];
  settings: Record<string, any>;
}
export const pluginSettings = storage.defineItem<PluginSettingsV1>(
  'local:pluginSettings',
  {
    version: 1,
    defaultValue: {
      toggle: true,
      enabled: ["subheader", "scroll-segments", "tab-title", "scroll-period", "timetable-labels"],
      settings: {},
    },
  }
);

export type ThemeSettingsV1 = {
  toggle: boolean;
  theme: string;
  flavour: string;
  accent: string;
  logo: string;
}
export const themeSettings = storage.defineItem<ThemeSettingsV1>(
  'local:themeSettings',
  {
    version: 1,
    defaultValue: {
      toggle: true,
      theme: 'catppuccin',
      flavour: 'macchiato',
      accent: 'rosewater',
      logo: 'schooltape.png',
    },
  }
);
