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

// Plugins
export const plugins: Record<Types.PluginId, Types.PluginData> = {
  subheader: {
    toggle: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-subheader", {
        fallback: {
          toggle: true,
        },
      }),
    ),
    info: {
      name: "Subheader Revamp",
      description: "Adds a clock and current period info to the subheader",
    },
  },
  scrollSegments: {
    toggle: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-scrollSegments", {
        fallback: {
          toggle: true,
        },
      }),
    ),
    info: {
      name: "Scroll Segments",
      description: "Segments the Schoolbox page into scrollable sections",
    },
  },
  scrollPeriod: {
    toggle: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-scrollPeriod", {
        fallback: {
          toggle: true,
        },
      }),
    ),
    info: {
      name: "Scroll Period",
      description: "Scrolls to the current period on the timetable",
    },
    settings: {
      toggle: {
        resetCooldownOnMouseMove: {
          toggle: new StorageState(
            storage.defineItem<Types.ToggleSetting>("local:plugin-scrollPeriod-resetCooldownOnMouseMove", {
              fallback: {
                toggle: true,
              },
            }),
          ),
          info: {
            name: "Reset on mouse move",
            description: "Whether to reset the scrolling cooldown when you move your mouse",
          },
        },
      },
      slider: {
        cooldownDuration: {
          slider: new StorageState(
            storage.defineItem<Types.SliderSetting>("local:plugin-scrollPeriod-cooldownDuration", {
              fallback: {
                min: 1,
                max: 60,
                value: 10,
              },
            }),
          ),
          info: {
            name: "Cooldown duration (s)",
            description: "How long to wait before scrolling",
          },
        },
      },
    },
  },
  progressBar: {
    toggle: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-progressBar", {
        fallback: {
          toggle: true,
        },
      }),
    ),
    info: {
      name: "Progress Bar",
      description: "Displays a progress bar below the timetable to show the time of the day",
    },
  },
  modernIcons: {
    toggle: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-modernIcons", {
        fallback: {
          toggle: true,
        },
      }),
    ),
    info: {
      name: "Modern Icons",
      description: "Modernise the icons across Schoolbox",
    },
    settings: {
      toggle: {
        filled: {
          toggle: new StorageState(
            storage.defineItem<Types.ToggleSetting>("local:plugin-modernIcons-filled", {
              fallback: {
                toggle: true,
              },
            }),
          ),
          info: {
            name: "Filled Icons",
            description: "Whether the icons should be filled or outlined",
          },
        },
      },
    },
  },
  tabTitle: {
    toggle: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-tabTitle", {
        fallback: {
          toggle: true,
        },
      }),
    ),
    info: {
      name: "Better Tab Titles",
      description: "Improves the tab titles for easier navigation",
    },
    settings: {
      toggle: {
        showSubjectPrefix: {
          toggle: new StorageState(
            storage.defineItem<Types.ToggleSetting>("local:plugin-tabTitle-showSubjectPrefix", {
              fallback: {
                toggle: true,
              },
            }),
          ),
          info: {
            name: "Show subject prefix",
            description: `e.g. "ENG - VCE English 1 & 2" becomes "VCE English 1 & 2"`,
          },
        },
      },
    },
  },
  homepageSwitcher: {
    toggle: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:plugin-homepageSwitcher", {
        fallback: {
          toggle: true,
        },
      }),
    ),
    info: {
      name: "Homepage Switcher",
      description: "The logo will switch to existing Schoolbox homepage when available",
    },
    settings: {
      toggle: {
        closeCurrentTab: {
          toggle: new StorageState(
            storage.defineItem<Types.ToggleSetting>("local:plugin-homepageSwitcher-closeCurrentTab", {
              fallback: {
                toggle: false,
              },
            }),
          ),
          info: {
            name: "Close current tab",
            description: "When switching to another tab, close the current one",
          },
        },
      },
    },
  },
};

// Snippets
export const snippets: Record<Types.SnippetId, Types.SnippetData> = {
  hidePfp: {
    toggle: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:snippet-hidePfp", {
        fallback: {
          toggle: true,
        },
      }),
    ),
    info: {
      name: "Hide PFP",
      description: "Hide your profile picture across Schoolbox.",
    },
  },
  hidePwaPrompt: {
    toggle: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:snippet-hidePwaPrompt", {
        fallback: {
          toggle: true,
        },
      }),
    ),
    info: {
      name: "Hide PWA Prompt",
      description: "Hides the prompt in the notifications menu to install Schoolbox as a PWA and enable notifications.",
    },
  },
  censor: {
    toggle: new StorageState(
      storage.defineItem<Types.ItemGeneric>("local:snippet-censor", {
        fallback: {
          toggle: false,
        },
      }),
    ),
    info: {
      name: "Censor",
      description: "Censors all text and images. This is intended for development purposes.",
    },
  },
};
