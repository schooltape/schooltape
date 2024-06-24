export type LogoDetails = {
  name: string;
  url: string;
  id: string;
  disable?: boolean; // whether the icon should be injected or not
};

// export type Script = {
//   execute: string;
//   path: string;
// };

// export type PluginData = {
//   name: string;
//   description: string;
//   scripts: Script[]; // This denotes an array of any length
// };

// export type PopulatedPlugin = {
//   id: string;
//   name: string;
//   description: string;
//   toggle: boolean;
// };


export type SnippetData = {
  name: string;
  description: string;
  path: string;
};

export type PopulatedSnippet = {
  id: string;
  name: string;
  description: string;
  path: string;
  toggle: boolean;
};

export type ExtensionStorageSchema = GlobalSettings & {
  snippets: SnippetSettings;
  plugins: PluginSettings;
  themes: ThemeSettings;
};

export type GlobalSettings = {
  global: boolean;
  updates: {
    available: boolean;
    desktop: boolean;
  };
  urls: string[];
  needsRefresh: boolean;
};


export type SnippetSettings = {
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



export type ThemeSettings = {
  toggle: boolean;
  theme: string;
  flavour: string;
  accent: string;
  logo: LogoDetails;
};

export type Plugin = {
  toggle: boolean;
  name: string;
  description: string;
  settings?: Record<string, any>;
}

export type PluginSettings = {
  toggle: boolean;
  plugins: Record<string, Plugin>;
};
