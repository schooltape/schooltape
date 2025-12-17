import { Plugin } from "@/utils/plugin";
import type { Toggle } from "@/utils/storage";
import type { StorageState } from "@/utils/storage/state.svelte";

const ID = "tabTitle";
let originalTitle: string | null = null;

export type Settings = {
  showSubjectPrefix: StorageState<Toggle>;
};

export default new Plugin<Settings>(
  {
    id: ID,
    name: "Better Tab Titles",
    description: "Improves the tab titles for easier navigation.",
  },
  true,
  {
    showSubjectPrefix: { toggle: true },
  },
  async (_ctx, settings) => {
    // if already injected, abort
    if (originalTitle) return;

    // backup original title (used for uninjection)
    originalTitle = document.title;

    const path = window.location.pathname;
    const titleMap: { [key: string]: string } = {
      "/": "Homepage",
      "/calendar": "Calendar",
      "/news": "News",
      "/learning/classes": "Classes",
      "/resources": "Resources",
      "/groups": "Groups",
      "/settings/notifications": "Notifications Settings",
      "/mail/create": "Compose Email",
      "/feedback": "Support and Feedback",
      "/policy": "Guidelines of Use and Privacy Policy",
    };

    if (titleMap[path]) {
      document.title = titleMap[path];
    } else if (path.includes("/timetable")) {
      document.title = "Timetable";
    } else if (path.includes("/calendar")) {
      document.title = "Calendar";
    } else if (path.includes("/grades/")) {
      document.title = "Grades";
    } else if (path.includes("/news/")) {
      document.title = `News (${document.getElementsByTagName("h1")[0].innerText})`;
    } else if (path.includes("/assessments/")) {
      document.title = `Assessments - ${document.getElementsByTagName("h1")[0].innerText})`;
    } else if (path.includes("/mail/create")) {
      document.title = "Compose Email";
    } else if (path.includes("/search/user")) {
      document.title = `Profile - ${document.getElementsByTagName("h1")[0].innerText}`;
    } else if (path.includes("/learning/due/")) {
      document.title = "Due Work";
    } else if (path.includes("/homepage/")) {
      if (!(await settings.showSubjectPrefix.get()).toggle) {
        document.title = document.getElementsByTagName("h1")[0].innerText.replace(/^.*- /, "");
      } else {
        document.title = document.getElementsByTagName("h1")[0].innerText;
      }
    }
  },
  () => {
    // if not injected, abort
    if (!originalTitle) return;

    document.title = originalTitle;
    originalTitle = null;
  },
  ["h1"],
);
