import * as Types from "./types";
import { StorageState } from "./state.svelte";

// Global
export const globalSettings = new StorageState<Types.Settings>(
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
      themeLogoAsFavicon: false,

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

type PluginData = {
  plugin: StorageState<Types.ToggleSetting, Types.PluginInfo>;
  settings?: {
    toggle?: StorageState<Types.ToggleSetting, Types.ItemInfo>[];
    slider?: StorageState<Types.SliderSetting, Types.ItemInfo>[];
  };
};
// Plugins
export const plugins: Record<Types.PluginId, PluginData> = {
  subheader: {
    plugin: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-subheader", {
        fallback: {
          toggle: true,
        },
      }),
      {
        name: "Subheader Revamp",
        description: "Adds a clock and current period info to the subheader",
      },
    ),
  },
  scrollSegments: {
    plugin: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-scrollSegments", {
        fallback: {
          toggle: true,
        },
      }),
      {
        name: "Scroll Segments",
        description: "Segments the Schoolbox page into scrollable sections",
      },
    ),
  },
  scrollPeriod: {
    plugin: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-scrollPeriod", {
        fallback: {
          toggle: true,
        },
      }),
      {
        name: "Scroll Period",
        description: "Scrolls to the current period on the timetable",
      },
    ),
    settings: {
      toggle: [
        new StorageState(
          storage.defineItem<Types.ToggleSetting>("local:plugin-scrollPeriod-resetCooldownOnMouseMove", {
            fallback: {
              toggle: true,
            },
          }),
          {
            name: "Reset on mouse move",
            description: "Whether to reset the scrolling cooldown when you move your mouse",
          },
        ),
      ],
      slider: [
        new StorageState(
          storage.defineItem<Types.SliderSetting>("local:plugin-scrollPeriod-cooldownDuration", {
            fallback: {
              min: 1,
              max: 60,
              value: 10,
            },
          }),
          {
            name: "Cooldown duration (s)",
            description: "How long to wait before scrolling",
          },
        ),
      ],
    },
  },
  progressBar: {
    plugin: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-progressBar", {
        fallback: {
          toggle: true,
        },
      }),
      {
        name: "Progress Bar",
        description: "Displays a progress bar below the timetable to show the time of the day",
      },
    ),
  },
  modernIcons: {
    plugin: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-modernIcons", {
        fallback: {
          toggle: true,
        },
      }),
      {
        name: "Modern Icons",
        description: "Modernise the icons across Schoolbox",
      },
    ),
    settings: {
      toggle: [
        new StorageState(
          storage.defineItem<Types.ToggleSetting>("local:plugin-modernIcons-filled", {
            fallback: {
              toggle: true,
            },
          }),
          {
            name: "Filled Icons",
            description: "Whether the icons should be filled or outlined",
          },
        ),
      ],
    },
  },
  tabTitle: {
    plugin: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-tabTitle", {
        fallback: {
          toggle: true,
        },
      }),
      {
        name: "Better Tab Titles",
        description: "Improves the tab titles for easier navigation",
      },
    ),
    settings: {
      toggle: [
        new StorageState(
          storage.defineItem<Types.ToggleSetting>("local:plugin-tabTitle-showHomepagePrefix", {
            fallback: {
              toggle: true,
            },
          }),
          {
            name: "Show homepage prefix",
            description: `e.g. "ENG - VCE English 1 & 2" becomes "VCE English 1 & 2"`,
          },
        ),
      ],
    },
  },
  homepageSwitcher: {
    plugin: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-homepageSwitcher", {
        fallback: {
          toggle: true,
        },
      }),
      {
        name: "Homepage Switcher",
        description: "The logo will switch to existing Schoolbox homepage when available",
      },
    ),
    settings: {
      toggle: [
        new StorageState(
          storage.defineItem<Types.ToggleSetting>("local:plugin-homepageSwitcher-closeCurrentTabOnSwitch", {
            fallback: {
              toggle: false,
            },
          }),
          {
            name: "Close current tab",
            description: "When switching to another tab, close the current one",
          },
        ),
      ],
    },
  },
};

// Snippets
export const snippets: Record<Types.SnippetId, StorageState<Types.SnippetGeneric, Types.SnippetInfo>> = {
  hidePfp: new StorageState(
    storage.defineItem<Types.SnippetGeneric>("local:snippet-hidePfp", {
      fallback: {
        toggle: true,
      },
    }),
    {
      name: "Hide PFP",
      description: "Hide your profile picture across Schoolbox.",
    },
  ),
  hidePwaPrompt: new StorageState(
    storage.defineItem<Types.SnippetGeneric>("local:snippet-hidePwaPrompt", {
      fallback: {
        toggle: true,
      },
    }),
    {
      name: "Hide PWA Prompt",
      description: "Hides the prompt in the notifications menu to install Schoolbox as a PWA and enable notifications.",
    },
  ),
  censor: new StorageState(
    storage.defineItem<Types.SnippetGeneric>("local:snippet-censor", {
      fallback: {
        toggle: false,
      },
    }),
    {
      name: "Censor",
      description: "Censors all text and images. This is intended for development purposes.",
    },
  ),
};
