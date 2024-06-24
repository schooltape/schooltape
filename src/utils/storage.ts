import * as Types from "./types";

// Global settings
export const globalSettings = storage.defineItem<Types.GlobalSettings>("local:globalSettings", {
  version: 1,
  defaultValue: {
    global: true,
    updates: {
      available: true,
      desktop: false,
    },
    urls: ["https://help.schoolbox.com.au"],
    needsRefresh: false,
  },
});

// Snippet settings
export const snippetSettings = storage.defineItem<Types.SnippetSettings>("local:snippetSettings", {
  version: 1,
  defaultValue: {
    toggle: true,
    enabled: ["hide-pfp"],
    user: {},
  },
});

// Plugin settings
export const pluginSettings = storage.defineItem<Types.PluginSettings>("local:pluginSettings", {
  version: 1,
  defaultValue: {
    toggle: true,
    enabled: ["subheader", "scroll-segments", "tab-title", "scroll-period", "timetable-labels"],
    settings: {},
  },
});

// Theme settings
export const themeSettings = storage.defineItem<Types.ThemeSettings>("local:themeSettings", {
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
