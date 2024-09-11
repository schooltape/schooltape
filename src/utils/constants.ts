import { SnippetInfo } from "./types";

export const PLUGIN_INFO: Record<string, PluginInfo> = {
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
    description: "Modernise the icons across Schoolbox.",
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
    description: "Moves the timetable to it's own row",
    order: 7,
  },
};

export const SNIPPET_INFO: Record<string, SnippetInfo> = {
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

export const LOGOS: LogoDetails[] = [
  {
    name: "Default",
    url: "default",
    id: "default",
    disable: true,
  },
  {
    name: "Catppuccin",
    id: "catppuccin",
    url: "https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png",
  },
  {
    name: "Schoolbox",
    id: "schoolbox",
    url: "schoolbox.svg",
  },
  {
    name: "Schooltape",
    id: "st",
    url: "https://schooltape.github.io/schooltape.svg",
  },
  {
    name: "ST Rainbow",
    id: "st-rainbow",
    url: "https://schooltape.github.io/schooltape-ctp.svg",
  },
  {
    name: "ST Legacy",
    id: "st-legacy",
    url: "https://schooltape.github.io/schooltape-legacy.svg",
  },
];
