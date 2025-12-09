import { defineContentScript } from "#imports";
import { EXCLUDE_MATCHES } from "@/utils/constants";
import homepageSwitcher from "./plugins/homepageSwitcher";
import modernIcons from "./plugins/modernIcons";
import progressBar from "./plugins/progressBar";
import scrollPeriod from "./plugins/scrollPeriod";
import scrollSegments from "./plugins/scrollSegments";
import subheader from "./plugins/subheader";
import tabTitle from "./plugins/tabTitle";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    subheader();
    scrollSegments();
    scrollPeriod();
    progressBar();
    modernIcons();
    tabTitle();
    homepageSwitcher();
  },
});
