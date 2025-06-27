import subheader from "./plugins/subheader";
import scrollSegments from "./plugins/scrollSegments";
import scrollPeriod from "./plugins/scrollPeriod";
import progressBar from "./plugins/progressBar";
import modernIcons from "./plugins/modernIcons";
import tabTitle from "./plugins/tabTitle";
import homepageSwitcher from "./plugins/homepageSwitcher";
import rearrange from "./plugins/rearrange";

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
    rearrange();
  },
});
