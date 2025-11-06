import { createPlugin, pluginSlider, pluginToggle } from "./helpers";
import * as Types from "./types";

export const plugins: Record<Types.PluginId, Types.PluginData> = {
  subheader: createPlugin(
    "subheader",
    "Subheader Revamp",
    "Adds a clock and current period info to the subheader.",
    true,
    {
      openInNewTab: pluginToggle(
        "subheader",
        "openInNewTab",
        "Open links in new tab",
        "Whether to open the class link in a new tab.",
        true,
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
    resetCooldownOnMouseMove: pluginToggle(
      "scrollPeriod",
      "resetCooldownOnMouseMove",
      "Reset on mouse move",
      "Whether to reset the scrolling cooldown when you move your mouse.",
      true,
    ),
    cooldownDuration: pluginSlider(
      "scrollPeriod",
      "cooldownDuration",
      "Cooldown duration (s)",
      "How long to wait before scrolling.",
      1,
      60,
      10,
    ),
  }),

  progressBar: createPlugin(
    "progressBar",
    "Progress Bar",
    "Displays a progress bar below the timetable to show the time of the day.",
    true,
  ),

  modernIcons: createPlugin("modernIcons", "Modern Icons", "Modernise the icons across Schoolbox.", true, {
    filled: pluginToggle(
      "modernIcons",
      "filled",
      "Filled Icons",
      "Whether the icons should be filled or outlined.",
      true,
    ),
  }),

  tabTitle: createPlugin("tabTitle", "Better Tab Titles", "Improves the tab titles for easier navigation.", true, {
    showSubjectPrefix: pluginToggle(
      "tabTitle",
      "showSubjectPrefix",
      "Show subject prefix",
      `e.g. "ENG - VCE English 1 & 2" becomes "VCE English 1 & 2"`,
      true,
    ),
  }),

  homepageSwitcher: createPlugin(
    "homepageSwitcher",
    "Homepage Switcher",
    "The logo will switch to existing Schoolbox homepage when available.",
    true,
    {
      closeCurrentTab: pluginToggle(
        "homepageSwitcher",
        "closeCurrentTab",
        "Close current tab",
        "When switching to another tab, close the current one.",
        false,
      ),
    },
  ),
};
