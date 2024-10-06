import { defineWxtModule, addWxtPlugin } from "wxt/modules";
import { resolve } from "node:path";

export default defineWxtModule({
  setup(wxt) {
    addWxtPlugin(wxt, resolve(__dirname, "plugins/smartLinks.ts"));
    addWxtPlugin(wxt, resolve(__dirname, "plugins/legacyTimetable.ts"));
    addWxtPlugin(wxt, resolve(__dirname, "plugins/modernIcons/index.ts"));
    addWxtPlugin(wxt, resolve(__dirname, "plugins/scrollPeriod.ts"));
    addWxtPlugin(wxt, resolve(__dirname, "plugins/scrollSegments/index.ts"));
    addWxtPlugin(wxt, resolve(__dirname, "plugins/subheader.js"));
    addWxtPlugin(wxt, resolve(__dirname, "plugins/tabTitle.js"));
    addWxtPlugin(wxt, resolve(__dirname, "plugins/timetableLabels.js"));
  },
});
