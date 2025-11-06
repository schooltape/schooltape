import { StorageState } from "./state.svelte";
import * as Types from "./types";

// Global
export const globalSettings: StorageState<Types.Settings> = new StorageState<Types.Settings>(
  storage.defineItem<Types.Settings>("local:globalSettings", {
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
  true,
);

export const needsRefresh = new StorageState(
  storage.defineItem<boolean>("local:needsRefresh", {
    fallback: false,
  }),
);

// whether schooltape was recently updated
export const updated = new StorageState(
  storage.defineItem<Types.UpdatedBadges>("local:updated", {
    version: 2,
    fallback: {
      icon: false,
      changelog: false,
    },
    migrations: {
      2: async () => {
        // reset to fallback
        await storage.removeItem("local:updated");
      },
    },
  }),
);

// message of the day
export const motd = new StorageState(
  storage.defineItem<Types.Motd>("local:motd", {
    fallback: {
      motd: "Free and <a href='https://github.com/schooltape/schooltape' class='text-(--ctp-accent)'> open source</a>!",
    },
  }),
);

export const schoolboxUrls = new StorageState(
  storage.defineItem<Types.SchoolboxUrls>("local:urls", {
    version: 1,
    fallback: {
      urls: ["https://help.schoolbox.com.au"],
    },
  }),
);

// Plugins
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

function pluginToggle(
  pluginId: string,
  settingId: string,
  name: string,
  description: string,
  fallback: boolean,
): Types.PluginSetting {
  return {
    type: "toggle",
    state: new StorageState(
      storage.defineItem<Types.ToggleState>(`local:${pluginId}-${settingId}`, {
        fallback: { toggle: fallback },
      }),
    ),
    info: { name, description },
  };
}

export function pluginSlider(
  pluginId: string,
  settingId: string,
  name: string,
  description: string,
  min: number,
  max: number,
  fallback: number,
): Types.PluginSetting {
  return {
    type: "slider",
    state: new StorageState(
      storage.defineItem<Types.SliderState>(`local:${pluginId}-${settingId}`, {
        fallback: { value: fallback, min, max },
      }),
    ),
    info: { name, description },
  };
}

export const plugins: Record<Types.PluginId, Types.PluginData> = {
  subheader: createPlugin(
    "subheader",
    "Subheader Revamp",
    "Adds a clock and current period info to the subheader.",
    true,
    {
      openInNewTab: pluginToggle(
        "subheaderRevamp",
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

// Snippets
function createSnippet(id: string, name: string, description: string, fallbackToggle: boolean) {
  return {
    toggle: new StorageState(
      storage.defineItem<Types.ToggleState>(`local:snippet-${id}`, {
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
