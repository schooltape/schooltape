import * as Types from "./types";
import { StorageState } from "./state.svelte";

// Global
export const globalSettings: StorageState<Types.Settings> = new StorageState<Types.Settings>(
  storage.defineItem<Types.Settings>("local:globalSettings", {
    version: 3,
    fallback: {
      global: true,
      plugins: true,
      themes: true,
      snippets: true,

      updated: false,
      motd: "Free and <a href='https://github.com/schooltape/schooltape' class='text-(--ctp-accent)'> open source</a>!",
      userSnippets: {},

      themeFlavour: "mocha",
      themeAccent: "mauve",
      themeLogo: "schooltape-rainbow",
      themeLogoAsFavicon: false,
    },
    migrations: {
      2: (oldData) => {
        needsRefresh.set(oldData.needsRefresh);
        schoolboxUrls.set(oldData.schoolboxUrls);
        return {
          ...globalSettings.storage.fallback,
          global: oldData.global,
        };
      },
      3: (oldData) => {
        return {
          ...oldData,
          ...globalSettings.storage.fallback,
        };
      },
    },
  }),
);

export const needsRefresh = new StorageState(
  storage.defineItem<boolean>("local:needsRefresh", {
    fallback: false,
  }),
);

export const schoolboxUrls = new StorageState(
  storage.defineItem<Types.SchoolboxUrls>("local:urls", {
    version: 2,
    fallback: {
      urls: ["https://help.schoolbox.com.au"],
    },
    migrations: {
      2: () => {
        return { urls: ["https://help.schoolbox.com.au"] };
      },
    },
  }),
);

// Plugins
function createPlugin(
  id: string,
  name: string,
  description: string,
  fallbackToggle: boolean,
  settings?: Types.PluginSettings,
) {
  const plugin: Types.PluginData = {
    toggle: new StorageState(
      storage.defineItem<Types.ItemGeneric>(`local:plugin-${id}`, {
        fallback: {
          toggle: fallbackToggle,
        },
      }),
    ),
    info: {
      name,
      description,
    },
  };

  if (settings) {
    plugin.settings = settings;
  }

  return plugin;
}

export const plugins: Record<Types.PluginId, Types.PluginData> = {
  subheader: createPlugin(
    "subheader",
    "Subheader Revamp",
    "Adds a clock and current period info to the subheader.",
    true,
  ),

  scrollSegments: createPlugin(
    "scrollSegments",
    "Scroll Segments",
    "Segments the Schoolbox page into scrollable sections.",
    true,
  ),

  scrollPeriod: createPlugin("scrollPeriod", "Scroll Period", "Scrolls to the current period on the timetable.", true, {
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
          description: "Whether to reset the scrolling cooldown when you move your mouse.",
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
          description: "How long to wait before scrolling.",
        },
      },
    },
  }),

  progressBar: createPlugin(
    "progressBar",
    "Progress Bar",
    "Displays a progress bar below the timetable to show the time of the day.",
    true,
  ),

  modernIcons: createPlugin("modernIcons", "Modern Icons", "Modernise the icons across Schoolbox.", true, {
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
          description: "Whether the icons should be filled or outlined.",
        },
      },
    },
  }),

  tabTitle: createPlugin("tabTitle", "Better Tab Titles", "Improves the tab titles for easier navigation.", true, {
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
  }),

  homepageSwitcher: createPlugin(
    "homepageSwitcher",
    "Homepage Switcher",
    "The logo will switch to existing Schoolbox homepage when available.",
    true,
    {
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
            description: "When switching to another tab, close the current one.",
          },
        },
      },
    },
  ),
};

// Snippets
function createSnippet(id: string, name: string, description: string, fallbackToggle: boolean) {
  return {
    toggle: new StorageState(
      storage.defineItem<Types.ItemGeneric>(`local:snippet-${id}`, {
        fallback: {
          toggle: fallbackToggle,
        },
      }),
    ),
    info: {
      name,
      description,
    },
  };
}

export const snippets: Record<Types.SnippetId, Types.SnippetData> = {
  roundedCorners: createSnippet(
    "roundedCorners",
    "Rounded Corners",
    "Adds rounded corners to all elements across Schoolbox.",
    true,
  ),

  hidePfp: createSnippet("hidePfp", "Hide PFP", "Hide your profile picture across Schoolbox.", true),

  hidePwaPrompt: createSnippet(
    "hidePwaPrompt",
    "Hide PWA Prompt",
    "Hides the prompt in the notifications menu to install Schoolbox as a PWA and enable notifications.",
    true,
  ),

  censor: createSnippet(
    "censor",
    "Censor",
    "Censors all text and images. This is intended for development purposes.",
    false,
  ),
};

// Legacy storage items from v3 used for migration
storage.defineItem("local:themeSettings", {
  version: 2,
  migrations: {
    2: (oldData) => {
      globalSettings.set({
        themes: oldData.themeToggle,
        themeFlavour: oldData.flavour,
        themeAccent: oldData.accent,
      });
    },
  },
});

storage.defineItem("local:pluginSettings", {
  version: 2,
  migrations: {
    2: (oldData) => {
      globalSettings.set({ plugins: oldData.toggle });
      plugins.subheader.toggle.set({ toggle: oldData.plugins.subheader.toggle });
      plugins.scrollSegments.toggle.set({ toggle: oldData.plugins.scrollSegments.toggle });
      plugins.scrollPeriod.toggle.set({ toggle: oldData.plugins.scrollPeriod.toggle });
      plugins.modernIcons.toggle.set({ toggle: oldData.plugins.modernIcons.toggle });
      plugins.tabTitle.toggle.set({ toggle: oldData.plugins.tabTitle.toggle });
      plugins.homepageSwitcher.toggle.set({ toggle: oldData.plugins.homepageSwitcher.toggle });
    },
  },
});

storage.defineItem("local:snippetSettings", {
  version: 2,
  migrations: {
    2: (oldData) => {
      globalSettings.set({ snippets: oldData.toggle, userSnippets: oldData.user });
      snippets.hidePfp.toggle.set({ toggle: oldData.snippets.hidePfp.toggle });
      snippets.censor.toggle.set({ toggle: oldData.snippets.censor.toggle });
    },
  },
});
