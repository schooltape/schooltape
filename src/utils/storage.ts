import { WxtStorageItem } from "wxt/storage";
import * as Types from "./types";

// Global
export const globalSettings = storage.defineItem<Types.Settings>("local:globalSettings", {
  version: 1,
  fallback: {
    global: true,
    plugins: true,
    themes: true,
    snippets: true,

    themeFlavour: "mocha",
    themeAccent: "mauve",
    themeLogo: "schooltape-rainbow",

    userSnippets: {},
    urls: ["https://help.schoolbox.com.au"],
    needsRefresh: false,
  },
});

// Plugins
export const plugins: Record<Types.PluginId, WxtStorageItem<Types.PluginGeneric, any>> = {
  subheader: storage.defineItem<Types.PluginGeneric>("local:plugin-subheader", {
    fallback: {
      toggle: true,
    },
  }),
  scrollSegments: storage.defineItem<Types.PluginGeneric>("local:plugin-scrollSegments", {
    fallback: {
      toggle: true,
    },
  }),
  scrollPeriod: storage.defineItem<Types.PluginGeneric>("local:plugin-scrollPeriod", {
    fallback: {
      toggle: true,
    },
  }),
  modernIcons: storage.defineItem<Types.PluginGeneric>("local:plugin-modernIcons", {
    fallback: {
      toggle: true,
    },
  }),
  tabTitle: storage.defineItem<Types.TabTitle>("local:plugin-tabTitle", {
    fallback: {
      toggle: true,
      showSubjectPrefix: true,
    },
  }),
  homepageSwitcher: storage.defineItem<Types.PluginGeneric>("local:plugin-homepageSwitcher", {
    fallback: {
      toggle: true,
    },
  }),
  timetableLabels: storage.defineItem<Types.PluginGeneric>("local:plugin-timetableLabels", {
    fallback: {
      toggle: true,
    },
  }),
  legacyTimetable: storage.defineItem<Types.PluginGeneric>("local:plugin-legacyTimetable", {
    fallback: {
      toggle: false,
    },
  }),
};

// Snippets
export const snippets: Record<Types.SnippetId, WxtStorageItem<Types.SnippetGeneric, any>> = {
  hidePfp: storage.defineItem<Types.SnippetGeneric>("local:snippet-hidePfp", {
    fallback: {
      toggle: true,
    },
  }),
  censor: storage.defineItem<Types.SnippetGeneric>("local:snippet-censor", {
    fallback: {
      toggle: false,
    },
  }),
};
