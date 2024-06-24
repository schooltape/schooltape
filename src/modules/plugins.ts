import { defineWxtModule, addWxtPlugin } from "wxt/modules";
import { resolve } from "node:path";

export default defineWxtModule({
  setup(wxt) {
    addWxtPlugin(wxt, resolve(__dirname, 'plugins/homepage-switcher.ts'));
    addWxtPlugin(wxt, resolve(__dirname, "plugins/legacy-timetable.ts"));
    addWxtPlugin(wxt, resolve(__dirname, 'plugins/modern-icons/index.ts'));
    addWxtPlugin(wxt, resolve(__dirname, 'plugins/scroll-period.ts'));
    addWxtPlugin(wxt, resolve(__dirname, 'plugins/scroll-segments/index.ts'));
    addWxtPlugin(wxt, resolve(__dirname, 'plugins/subheader.js'));
    addWxtPlugin(wxt, resolve(__dirname, 'plugins/tab-title.js'));
    addWxtPlugin(wxt, resolve(__dirname, 'plugins/timetable-labels.js'));
  },
});

