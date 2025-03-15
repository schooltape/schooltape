// @ts-ignore
import subheader from "./plugins/subheader";
import scrollSegments from "./plugins/scrollSegments";
import scrollPeriod from "./plugins/scrollPeriod";
import progressBar from "./plugins/progressBar";
import modernIcons from "./plugins/modernIcons";
// @ts-ignore
import tabTitle from "./plugins/tabTitle";
import homepageSwitcher from "./plugins/homepageSwitcher";
// @ts-ignore
import timetableLabels from "./plugins/timetableLabels";
import legacyTimetable from "./plugins/legacyTimetable";
import switcharoo from "./plugins/switcharoo";

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
    timetableLabels();
    legacyTimetable();
    switcharoo();
  },
});
