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
export const plugins: Record<Types.PluginId, StorageState<Types.PluginGeneric, Types.PluginInfo>> = {
  subheader: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-subheader", {
      fallback: {
        toggle: true,
      },
    }),
    {
      name: "Subheader Revamp",
      description: "Adds a clock and current period info to the subheader",
    },
  ),
  scrollSegments: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-scrollSegments", {
      fallback: {
        toggle: true,
      },
    }),
    {
      name: "Scroll Segments",
      description: "Segments the Schoolbox page into scrollable sections",
    },
  ),
  scrollPeriod: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-scrollPeriod", {
      fallback: {
        toggle: true,
        settings: {
          toggle: {
            resetCooldownOnMouseMove: {
              name: "Reset on mouse move",
              description: "Whether to reset the scrolling cooldown when you move your mouse",
              toggle: true,
            } as ToggleSetting,
          },
          slider: {
            cooldownDuration: {
              name: "Cooldown duration (s)",
              description: "How long to wait before scrolling",
              min: 1,
              max: 60,
              value: 10,
            },
          },
        },
      },
    }),
    {
      name: "Scroll Period",
      description: "Scrolls to the current period on the timetable",
    },
  ),
  progressBar: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-progressBar", {
      fallback: {
        toggle: true,
      },
    }),
    {
      name: "Progress Bar",
      description: "Displays a progress bar below the timetable to show the time of the day",
    },
  ),
  modernIcons: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-modernIcons", {
      fallback: {
        toggle: true,
      },
    }),
    {
      name: "Modern Icons",
      description: "Modernise the icons across Schoolbox",
    },
  ),
  tabTitle: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-tabTitle", {
      fallback: {
        toggle: true,
        settings: {
          toggle: {
            showSubjectPrefix: {
              name: "Show homepage prefix",
              description: 'e.g. "ENG - VCE English 1 & 2" becomes "VCE English 1 & 2"',
              toggle: true,
            } as Types.ToggleSetting,
          },
        },
      },
    }),
    {
      name: "Better Tab Titles",
      description: "Improves the tab titles for easier navigation",
    },
  ),
  homepageSwitcher: new StorageState(
    storage.defineItem<Types.PluginGeneric>("local:plugin-homepageSwitcher", {
      fallback: {
        toggle: true,
      },
    }),
    {
      name: "Homepage Switcher",
      description: "The logo will switch to existing Schoolbox homepage when available",
    },
  ),
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
