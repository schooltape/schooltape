import * as Types from "./types";
import { StorageState } from "./state.svelte";

// Global
export const globalSettings = new StorageState(
  storage.defineItem<Types.Settings>("local:globalSettings", {
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
  }),
);
export const needsRefresh = new StorageState(
  storage.defineItem<boolean>("local:needsRefresh", {
    fallback: false,
  }),
);
export const schoolboxUrls = new StorageState(
  storage.defineItem<string[]>("local:urls", {
    fallback: ["https://help.schoolbox.com.au"],
  }),
);

// Plugins
export const plugins: Record<Types.PluginId, StorageState<Types.PluginGeneric>> = {
  subheader: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-subheader", {
      fallback: {
        toggle: true,
      },
    }),
  ),
  scrollSegments: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-scrollSegments", {
      fallback: {
        toggle: true,
      },
    }),
  ),
  scrollPeriod: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-scrollPeriod", {
      fallback: {
        toggle: true,
      },
    }),
  ),
  progressBar: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-progressBar", {
      fallback: {
        toggle: true,
      },
    }),
  ),
  modernIcons: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-modernIcons", {
      fallback: {
        toggle: true,
      },
    }),
  ),
  tabTitle: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-tabTitle", {
      fallback: {
        toggle: true,
        settings: {
          showSubjectPrefix: true,
        },
      },
    }),
  ),
  homepageSwitcher: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-homepageSwitcher", {
      fallback: {
        toggle: true,
      },
    }),
  ),
};

// Snippets
export const snippets: Record<Types.SnippetId, StorageState<Types.SnippetGeneric>> = {
  hidePfp: new StorageState(
    storage.defineItem<Types.SnippetGeneric>("local:snippet-hidePfp", {
      fallback: {
        toggle: true,
      },
    }),
  ),
  hidePwaPrompt: new StorageState(
    storage.defineItem<Types.SnippetGeneric>("local:snippet-hidePwaPrompt", {
      fallback: {
        toggle: true,
      },
    }),
  ),
  censor: new StorageState(
    storage.defineItem<Types.SnippetGeneric>("local:snippet-censor", {
      fallback: {
        toggle: false,
      },
    }),
  ),
};
