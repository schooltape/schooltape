import { dataAttr, setDataAttr } from "@/utils";
import { definePlugin } from "@/utils/plugin";

const ID = "tabTitle";
const PLUGIN_ID = `plugin-${ID}`;

export default function init() {
  definePlugin(
    ID,
    async (settings) => {
      // if already injected, skip
      if (document.querySelector(`meta${dataAttr(PLUGIN_ID)}`)) return;

      // backup original title (used for uninjection)
      const meta = document.createElement("meta");
      setDataAttr(meta, PLUGIN_ID);
      meta.name = "original-title"; // not needed but good label
      meta.content = document.title;
      document.head.appendChild(meta);

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
        if (settings?.toggle.showSubjectPrefix === false) {
          document.title = document.getElementsByTagName("h1")[0].innerText.replace(/^.*- /, "");
        } else {
          document.title = document.getElementsByTagName("h1")[0].innerText;
        }
      }
    },
    () => {
      const meta = document.querySelector<HTMLMetaElement>(`meta${dataAttr(PLUGIN_ID)}`);
      if (meta) {
        document.title = meta.content;
        document.head.removeChild(meta);
      }
    },
    ["h1"],
  );
}
