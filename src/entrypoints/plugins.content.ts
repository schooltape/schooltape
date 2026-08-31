import { defineContentScript } from "#imports";
import { EXCLUDE_MATCHES } from "@/utils/constants";
import censor from "./plugins/censor";
import changeLogo from "./plugins/changeLogo";
import hidePfp from "./plugins/hidePfp";
import hidePwaPrompt from "./plugins/hidePwaPrompt";
import homepageSwitcher from "./plugins/homepageSwitcher";
import iframeNewTab from "./plugins/iframeNewTab";
import modernIcons from "./plugins/modernIcons";
import progressBar from "./plugins/progressBar";
import roundedCorners from "./plugins/roundedCorners";
import scrollPeriod from "./plugins/scrollPeriod";
import scrollSegments from "./plugins/scrollSegments";
import subheader from "./plugins/subheader";
import tabTitle from "./plugins/tabTitle";

export const plugins = [
  subheader,
  scrollSegments,
  scrollPeriod,
  progressBar,
  modernIcons,
  tabTitle,
  changeLogo,
  iframeNewTab,
  hidePfp,
  hidePwaPrompt,
  roundedCorners,
  homepageSwitcher,
  censor,
];

export type PluginInstance = (typeof plugins)[number];

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
