import { LogoId, LogoInfo, PluginId, PluginInfo, SnippetId, SnippetInfo } from "./types";

export const PLUGIN_INFO: Record<PluginId, PluginInfo> = {
  subheader: {
    name: "Subheader Revamp",
    description: "Adds a clock and current period info to the subheader",
    order: 0,
  },
  scrollSegments: {
    name: "Scroll Segments",
    description: "Segments the Schoolbox page into scrollable sections",
    order: 1,
  },
  scrollPeriod: {
    name: "Scroll Period",
    description: "Scrolls to the current period on the timetable",
    order: 2,
  },
  modernIcons: {
    name: "Modern Icons",
    description: "Modernise the icons across Schoolbox",
    order: 3,
  },
  tabTitle: {
    name: "Better Tab Titles",
    description: "Improves the tab titles for easier navigation",
    order: 4,
  },
  homepageSwitcher: {
    name: "Homepage Switcher",
    description: "The logo will switch to existing Schoolbox homepage when available",
    order: 5,
  },
  timetableLabels: {
    name: "Timetable Labels",
    description: "Labels the day of the week from numbers to the actual day",
    order: 6,
  },
  legacyTimetable: {
    name: "Legacy Timetable",
    description: "Moves the timetable to its own row",
    order: 7,
  },
};

export const SNIPPET_INFO: Record<SnippetId, SnippetInfo> = {
  hidePfp: {
    name: "Hide PFP",
    description: "Hide your profile picture across Schoolbox.",
    order: 0,
  },
  censor: {
    name: "Censor",
    description: "Censors all text and images. This is intended for development purposes.",
    order: 1,
  },
};

export const LOGO_INFO: Record<LogoId, LogoInfo> = {
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
