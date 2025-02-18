export type PluginId =
  | "subheader"
  | "scrollSegments"
  | "scrollPeriod"
  | "modernIcons"
  | "tabTitle"
  | "homepageSwitcher"
  | "timetableLabels"
  | "legacyTimetable";

export interface PluginInfo {
  name: string;
  description: string;
  order: number;
}

export interface PluginGeneric {
  toggle: boolean;
  // extend this type for plugin-specific settings
}

export interface TabTitle extends PluginGeneric {
  showSubjectPrefix: boolean;
}
