import { defineContentScript } from "#imports";
import { EXCLUDE_MATCHES } from "@/utils/constants";
import changeLogo from "./plugins/changeLogo";
import homepageSwitcher from "./plugins/homepageSwitcher";
import iframeNewTab from "./plugins/iframeNewTab";
import IframeNewTabShortcut from "./plugins/iframeNewTab/App.svelte";
import modernIcons from "./plugins/modernIcons";
import progressBar from "./plugins/progressBar";
import scrollPeriod from "./plugins/scrollPeriod";
import scrollSegments from "./plugins/scrollSegments";
import subheader from "./plugins/subheader";
import tabTitle from "./plugins/tabTitle";

export const plugins = {
  subheader,
  scrollSegments,
  scrollPeriod,
  progressBar,
  modernIcons,
  tabTitle,
  changeLogo,
  iframeNewTab,
  homepageSwitcher,
};

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,

  async main(ctx) {
    document.addEventListener("DOMContentLoaded", () => {
      changeLogo.init(ctx);
      homepageSwitcher.init(ctx);
      iframeNewTab.init(ctx, { Shortcut: IframeNewTabShortcut });
      modernIcons.init(ctx);
      progressBar.init(ctx);
      scrollPeriod.init(ctx);
      scrollSegments.init(ctx);
      subheader.init(ctx);
      tabTitle.init(ctx);
    });
  },
});
