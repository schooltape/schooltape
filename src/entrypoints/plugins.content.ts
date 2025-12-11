import { defineContentScript } from "#imports";
import { EXCLUDE_MATCHES } from "@/utils/constants";
import type { Plugin } from "@/utils/plugin";

import homepageSwitcher from "./plugins/homepageSwitcher";
import modernIcons from "./plugins/modernIcons";
import progressBar from "./plugins/progressBar";
import scrollPeriod from "./plugins/scrollPeriod";
import scrollSegments from "./plugins/scrollSegments";
import subheader from "./plugins/subheader";
import tabTitle from "./plugins/tabTitle";

export const plugins: Plugin<any>[] = [
  homepageSwitcher,
  modernIcons,
  progressBar,
  scrollPeriod,
  scrollSegments,
  subheader,
  tabTitle,
];

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    document.addEventListener("DOMContentLoaded", () => {
      for (const plugin of plugins) {
        plugin.init();
      }
    });
  },
});
