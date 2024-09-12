import * as Types from "./types";

// Global settings
export const globalSettings = storage.defineItem<Types.GlobalSettings>("local:globalSettings", {
  version: 1,
  defaultValue: {
    global: true,
    urls: ["https://help.schoolbox.com.au"],
    needsRefresh: false,
  },
});

// Snippet settings
export const snippetSettings = storage.defineItem<Types.SnippetSettings>("local:snippetSettings", {
  version: 1,
  defaultValue: {
    toggle: true,
    snippets: {
      hidePfp: {
        toggle: true,
      },
      censor: {
        toggle: false,
      },
    },
    user: {},
  },
});

// Plugin settings
// Plugins considered very cross-compatible between Schoolbox instances are enabled by default
export const pluginSettings = storage.defineItem<Types.PluginSettings>("local:pluginSettings", {
  version: 1,
  defaultValue: {
    toggle: true,
    plugins: {
      subheader: {
        toggle: true,
        options: {},
      },
      scrollSegments: {
        toggle: true,
      },
      scrollPeriod: {
        toggle: true,
      },
      modernIcons: {
        toggle: true,
        options: {},
      },
      tabTitle: {
        toggle: true,
      },
      smartLinks: {
        toggle: true,
      },
      timetableLabels: {
        toggle: true,
      },
      legacyTimetable: {
        toggle: false,
      },
    },
  },
});

// Theme settings
export const themeSettings = storage.defineItem<Types.ThemeSettings>("local:themeSettings", {
  version: 1,
  defaultValue: {
    toggle: true,
    theme: "catppuccin",
    flavour: "mocha",
    accent: "mauve",
    logo: {
      name: "ST Rainbow",
      id: "st-rainbow",
      url: "https://schooltape.github.io/schooltape-ctp.svg",
    },
  },
});
