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
    snippetOrder: [
      "hide-pfp",
      "censor",
    ],
    snippets: {
      "hide-pfp": {
        toggle: true,
        name: "Hide PFP",
        description: "Hide your profile picture across Schoolbox.",
      },
      "censor": {
        toggle: false,
        name: "Censor",
        description: "Censors all text and images. This is intended for development purposes.",
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
    pluginOrder: [
      "subheader",
      "scroll-segments",
      "scroll-period",
      "modern-icons",
      "tab-title",
      "homepage-switcher",
      "timetable-labels",
      "legacy-timetable",
    ],
    plugins: {
      "subheader": {
        toggle: true,
        name: "Subheader Revamp",
        description: "Adds a clock and current period info to the subheader",
        settings: {},
      },
      "scroll-segments": {
        toggle: true,
        name: "Scroll Segments",
        description: "Segments the Schoolbox page into scrollable sections",
      },
      "scroll-period": {
        toggle: true,
        name: "Scroll Period",
        description: "Scrolls to the current period on the timetable",
      },
      "modern-icons": {
        toggle: true,
        name: "Modern Icons",
        description: "Modernise the icons across Schoolbox.",
        settings: {},
      },
      "tab-title": {
        toggle: true,
        name: "Better Tab Titles",
        description: "Improves the tab titles for easier navigation",
      },
      "homepage-switcher": {
        toggle: true,
        name: "Homepage Switcher",
        description: "The logo will switch to existing Schoolbox homepage when available"
      },
      "timetable-labels": {
        toggle: true,
        name: "Timetable Labels",
        description: "Labels the day of the week from numbers to the actual day",
      },
      "legacy-timetable": {
        toggle: false,
        name: "Legacy Timetable",
        description: "Moves the timetable to it's own row",
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
    flavour: "macchiato",
    accent: "rosewater",
    logo: {
      name: "ST Rainbow",
      id: "st-rainbow",
      url: "https://schooltape.github.io/schooltape-ctp.svg",
    },
  },
});
