import { WxtStorageItem } from "wxt/storage";
import { PluginGeneric, PluginId, TabTitle } from "./types";

export const plugins: Record<PluginId, WxtStorageItem<PluginGeneric, any>> = {
  subheader: storage.defineItem<PluginGeneric>("local:plugin-subheader", {
    fallback: {
      toggle: true,
    },
  }),
  scrollSegments: storage.defineItem<PluginGeneric>("local:plugin-scrollSegments", {
    fallback: {
      toggle: true,
    },
  }),
  scrollPeriod: storage.defineItem<PluginGeneric>("local:plugin-scrollPeriod", {
    fallback: {
      toggle: true,
    },
  }),
  modernIcons: storage.defineItem<PluginGeneric>("local:plugin-modernIcons", {
    fallback: {
      toggle: true,
    },
  }),
  tabTitle: storage.defineItem<TabTitle>("local:plugin-tabTitle", {
    fallback: {
      toggle: true,
      showSubjectPrefix: true,
    },
  }),
  homepageSwitcher: storage.defineItem<PluginGeneric>("local:plugin-homepageSwitcher", {
    fallback: {
      toggle: true,
    },
  }),
  timetableLabels: storage.defineItem<PluginGeneric>("local:plugin-timetableLabels", {
    fallback: {
      toggle: true,
    },
  }),
  legacyTimetable: storage.defineItem<PluginGeneric>("local:plugin-legacyTimetable", {
    fallback: {
      toggle: false,
    },
  }),
};
