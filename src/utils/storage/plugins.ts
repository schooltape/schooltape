import { storage } from "#imports";
import { StorageState } from "./state.svelte";
import type * as Types from "./types";

export const pluginConfig: Record<string, Types.PluginConfig> = {
  subheader: {
    name: "Subheader Revamp",
    description: "Adds a clock and current period info to the subheader.",
    default: true,
    settings: {
      openInNewTab: {
        type: "toggle",
        name: "Open links in new tab",
        description: "Whether to open the class link in a new tab.",
        default: { toggle: true },
      },
    },
  },
  scrollSegments: {
    name: "Scroll Segments",
    description: "Segments the Schoolbox page into scrollable sections.",
    default: true,
  },
  scrollPeriod: {
    name: "Scroll Period",
    description: "Scrolls to the current period on the timetable.",
    default: true,
    settings: {
      resetCooldownOnMouseMove: {
        type: "toggle",
        name: "Reset on mouse move",
        description: "Whether to reset the scrolling cooldown when you move your mouse.",
        default: { toggle: true },
      },
      cooldownDuration: {
        type: "slider",
        name: "Cooldown duration (s)",
        description: "How long to wait before scrolling.",
        default: { min: 1, max: 60, value: 10 },
      },
    },
  },
  progressBar: {
    name: "Progress Bar",
    description: "Displays a progress bar below the timetable to show the time of the day.",
    default: true,
  },
  modernIcons: {
    name: "Modern Icons",
    description: "Modernise the icons across Schoolbox.",
    default: true,
    settings: {
      filled: {
        type: "toggle",
        name: "Filled icons",
        description: "Whether the icons should be filled or outlined.",
        default: { toggle: true },
      },
    },
  },
  tabTitle: {
    name: "Better Tab Titles",
    description: "Improves the tab titles for easier navigation.",
    default: true,
    settings: {
      showSubjectPrefix: {
        type: "toggle",
        name: "Show subject prefix",
        description: `e.g. "ENG - VCE English 1 & 2" becomes "VCE English 1 & 2"`,
        default: { toggle: true },
      },
    },
  },
  homepageSwitcher: {
    name: "Homepage Switcher",
    description: "The logo will switch to existing Schoolbox homepage when available.",
    default: true,
    settings: {
      closeCurrentTab: {
        type: "toggle",
        name: "Close current tab",
        description: "When switching to another tab, close the current one.",
        default: { toggle: false },
      },
    },
  },
} as const;

export const plugins = buildPluginsFromConfig(pluginConfig);

function buildPluginsFromConfig(config: Record<string, Types.PluginConfig>): Record<Types.PluginId, Types.PluginData> {
  const plugins: Partial<Record<Types.PluginId, Types.PluginData>> = {};

  for (const [pluginId, pluginConfig] of Object.entries(config)) {
    const plugin: Types.PluginData = {
      name: pluginConfig.name,
      description: pluginConfig.description,
      toggle: new StorageState(
        storage.defineItem<Types.Toggle>(`local:plugin-${pluginId}`, {
          fallback: { toggle: pluginConfig.default },
        }),
      ),
    };

    // define settings
    if (pluginConfig.settings) {
      plugin.settings = {};

      // iterate over each setting and create state
      for (const [settingId, settingConfig] of Object.entries(pluginConfig.settings)) {
        let state;
        if (settingConfig.type === "toggle") {
          state = new StorageState(
            storage.defineItem<Types.Toggle>(`local:plugin-${pluginId}-${settingId}`, {
              fallback: settingConfig.default,
            }),
          );
        } else {
          state = new StorageState(
            storage.defineItem<Types.Slider>(`local:plugin-${pluginId}-${settingId}`, {
              fallback: settingConfig.default,
            }),
          );
        }
        plugin.settings[settingId] = {
          state,
          type: settingConfig.type,
          name: settingConfig.name,
          description: settingConfig.description,
        } as Types.PluginSetting;
      }
    }

    plugins[pluginId as Types.PluginId] = plugin;
  }

  return plugins as Record<Types.PluginId, Types.PluginData>;
}
