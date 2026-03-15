import { defineContentScript } from "#imports";
import { EXCLUDE_MATCHES } from "@/utils/constants";
import changeLogo from "./plugins/changeLogo";
import homepageSwitcher from "./plugins/homepageSwitcher";
import iframeNewTab from "./plugins/iframeNewTab";
import modernIcons from "./plugins/modernIcons";
import progressBar from "./plugins/progressBar";
import scrollPeriod from "./plugins/scrollPeriod";
import scrollSegments from "./plugins/scrollSegments";
import subheader from "./plugins/subheader";
import tabTitle from "./plugins/tabTitle";
import App from "./plugins/iframeNewTab/App.svelte";

export const plugins = [
  subheader,
  scrollSegments,
  scrollPeriod,
  progressBar,
  modernIcons,
  tabTitle,
  changeLogo,
  homepageSwitcher,
];

export type PluginInstance = (typeof plugins)[number];

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,

  async main(ctx) {
    document.addEventListener("DOMContentLoaded", () => {
      for (const plugin of plugins) {
        plugin.init(ctx);
      }
      iframeNewTab.init(ctx, App as any);
    });
  },
});
