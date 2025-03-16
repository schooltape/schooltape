import * as Types from "./types";

// Global
export const EXCLUDE_MATCHES: string[] = ["*://*/learning/quiz/*"];
export const LOGO_INFO: Record<Types.LogoId, Types.LogoInfo> = {
  default: {
    name: "Default",
    url: "default",
    disable: true,
  },
  catppuccin: {
    name: "Catppuccin",
    url: "https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png",
  },
  schoolbox: {
    name: "Schoolbox",
    url: "schoolbox.svg",
    adaptive: true,
  },
  schooltape: {
    name: "Schooltape",
    url: "https://schooltape.github.io/schooltape.svg",
  },
  "schooltape-rainbow": {
    name: "ST Rainbow",
    url: "https://schooltape.github.io/schooltape-ctp.svg",
  },
  "schooltape-legacy": {
    name: "ST Legacy",
    url: "https://schooltape.github.io/schooltape-legacy.svg",
  },
};

// Plugins
export const PLUGIN_INFO: Record<Types.PluginId, Types.PluginInfo> = {
  subheader: {
    name: "Subheader Revamp",
    description: "Adds a clock and current period info to the subheader",
  },
  scrollSegments: {
    name: "Scroll Segments",
    description: "Segments the Schoolbox page into scrollable sections",
  },
  progressBar: {
    name: "Progress Bar",
    description: "Displays a progress bar below the timetable to show the time of the day",
  },
  scrollPeriod: {
    name: "Scroll Period",
    description: "Scrolls to the current period on the timetable",
  },
  modernIcons: {
    name: "Modern Icons",
    description: "Modernise the icons across Schoolbox",
  },
  tabTitle: {
    name: "Better Tab Titles",
    description: "Improves the tab titles for easier navigation",
  },
  homepageSwitcher: {
    name: "Homepage Switcher",
    description: "The logo will switch to existing Schoolbox homepage when available",
  },
  legacyTimetable: {
    name: "Legacy Timetable",
    description: "Moves the timetable to its own row",
  },
};

// Snippets
export const SNIPPET_INFO: Record<Types.SnippetId, Types.SnippetInfo> = {
  hidePfp: {
    name: "Hide PFP",
    description: "Hide your profile picture across Schoolbox.",
  },
  hidePwaPrompt: {
    name: "Hide PWA Prompt",
    description: "Hides the prompt in the notifications menu to install Schoolbox as a PWA and enable notifications.",
  },
  censor: {
    name: "Censor",
    description: "Censors all text and images. This is intended for development purposes.",
  },
};
