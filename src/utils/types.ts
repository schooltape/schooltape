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
export type PluginOption =
  | TextInputOption
  | CheckboxOption
  | ToggleOption
  | RadioButtonOption
  | SelectOption;

export type TextInputOption = {
  type: 'text';
  label: string;
  name: string;
  placeholder?: string;
  default?: string;
  value?: string;
};

export type CheckboxOption = {
  type: 'checkbox';
  label: string;
  name: string;
  default?: boolean;
  value?: boolean;
};

export type ToggleOption = {
  type: 'toggle';
  label: string;
  name: string;
  default?: boolean;
  value?: boolean;
};

export type RadioButtonOption = {
  type: 'radio';
  label: string;
  name: string;
  default?: string;
  value?: string;
  options: {
    label: string;
    value: string;
  }[];
};

export type SelectOption = {
  type: 'select';
  label: string;
  name: string;
  default?: string;
  value?: string;
  options: {
    label: string;
    value: string;
  }[];
};

export type PluginData = {
  toggle: boolean; // Overall toggle for enabling/disabling the plugin
  options?: Record<string, PluginOption[]>; // Options are an array of PluginOption objects for each plugin
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
