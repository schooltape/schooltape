// @ts-expect-error js plugin
import subheader from "./plugins/subheader";
import scrollSegments from "./plugins/scrollSegments";
import scrollPeriod from "./plugins/scrollPeriod";
import progressBar from "./plugins/progressBar";
import modernIcons from "./plugins/modernIcons";
// @ts-expect-error js plugin
import tabTitle from "./plugins/tabTitle";
import homepageSwitcher from "./plugins/homepageSwitcher";
import legacyTimetable from "./plugins/legacyTimetable";

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
    legacyTimetable();
  },
});
