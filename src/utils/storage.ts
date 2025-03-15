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
  },
});
export const needsRefresh = storage.defineItem<boolean>("local:needsRefresh", {
  fallback: false,
});
export const schoolboxUrls = storage.defineItem<string[]>("local:urls", {
  fallback: ["https://help.schoolbox.com.au"],
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
  progressBar: storage.defineItem<Types.PluginGeneric>("local:plugin-progressBar", {
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
  switcharoo: storage.defineItem<Types.PluginGeneric>("local:plugin-switcharoo", {
    fallback: {
      toggle: true,
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
  hidePwaPrompt: storage.defineItem<Types.SnippetGeneric>("local:snippet-hidePwaPrompt", {
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
