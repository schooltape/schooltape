import { StorageState } from "./state.svelte";
import * as Types from "./types";

export const plugins: Record<Types.PluginId, Types.PluginData> = {
  subheader: createPlugin(
    "subheader",
    "Subheader Revamp",
    "Adds a clock and current period info to the subheader.",
    true,
    {
      openInNewTab: pluginSetting(
        "toggle",
        "subheader",
        "openInNewTab",
        "Open links in new tab",
        "Whether to open the class link in a new tab.",
        { toggle: true },
      ),
    },
  ),

  scrollSegments: createPlugin(
    "scrollSegments",
    "Scroll Segments",
    "Segments the Schoolbox page into scrollable sections.",
    true,
  ),

  scrollPeriod: createPlugin("scrollPeriod", "Scroll Period", "Scrolls to the current period on the timetable.", true, {
    resetCooldownOnMouseMove: pluginSetting(
      "toggle",
      "scrollPeriod",
      "resetCooldownOnMouseMove",
      "Reset on mouse move",
      "Whether to reset the scrolling cooldown when you move your mouse.",
      { toggle: true },
    ),
    cooldownDuration: pluginSetting(
      "slider",
      "scrollPeriod",
      "cooldownDuration",
      "Cooldown duration (s)",
      "How long to wait before scrolling.",
      { min: 1, max: 60, value: 10 },
    ),
  }),

  progressBar: createPlugin(
    "progressBar",
    "Progress Bar",
    "Displays a progress bar below the timetable to show the time of the day.",
    true,
  ),

  modernIcons: createPlugin("modernIcons", "Modern Icons", "Modernise the icons across Schoolbox.", true, {
    filled: pluginSetting(
      "toggle",
      "modernIcons",
      "filled",
      "Filled Icons",
      "Whether the icons should be filled or outlined.",
      { toggle: true },
    ),
  }),

  tabTitle: createPlugin("tabTitle", "Better Tab Titles", "Improves the tab titles for easier navigation.", true, {
    showSubjectPrefix: pluginSetting(
      "toggle",
      "tabTitle",
      "showSubjectPrefix",
      "Show subject prefix",
      `e.g. "ENG - VCE English 1 & 2" becomes "VCE English 1 & 2"`,
      { toggle: true },
    ),
  }),

  homepageSwitcher: createPlugin(
    "homepageSwitcher",
    "Homepage Switcher",
    "The logo will switch to existing Schoolbox homepage when available.",
    true,
    {
      closeCurrentTab: pluginSetting(
        "toggle",
        "homepageSwitcher",
        "closeCurrentTab",
        "Close current tab",
        "When switching to another tab, close the current one.",
        { toggle: true },
      ),
    },
  ),
};

function createPlugin(
  id: string,
  name: string,
  description: string,
  fallbackToggle: boolean,
  settings?: Record<string, Types.PluginSetting>,
) {
  const plugin: Types.PluginData = {
    toggle: new StorageState(
      storage.defineItem<Types.ToggleState>(`local:plugin-${id}`, {
        fallback: {
          toggle: fallbackToggle,
        },
      }),
      true,
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

export function pluginSetting(
  type: "toggle" | "slider",
  pluginId: Types.PluginId,
  settingId: string,
  name: string,
  description: string,
  fallback: Types.ToggleState | Types.SliderState,
): Types.PluginSetting {
  if (type === "toggle") {
    return {
      type: "toggle",
      state: new StorageState(
        storage.defineItem<Types.ToggleState>(`local:${pluginId}-${settingId}`, {
          fallback: fallback as Types.ToggleState,
        }),
      ),
      info: { name, description },
    };
  } else {
    return {
      type: "slider",
      state: new StorageState(
        storage.defineItem<Types.SliderState>(`local:${pluginId}-${settingId}`, {
          fallback: fallback as Types.SliderState,
        }),
      ),
      info: { name, description },
    };
  }
}
