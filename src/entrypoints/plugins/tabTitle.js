export default function init() {
  defineStPlugin(
    "tabTitle",
    () => {
      const path = window.location.pathname;
      const titleMap = {
        "/": "Homepage",
        "/calendar": "Calendar",
        "/news": "News",
        "/learning/classes": "Classes",
        "/resources": "Resources",
        "/settings/messages": "Message Settings",
        "/mail/create": "Compose Email",
        "/feedback": "Support and Feedback",
        "/policy": "Guidelines of Use and Privacy Policy",
      };

      if (Object.prototype.hasOwnProperty.call(titleMap, path)) {
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
        document.title = document.getElementsByTagName("h1")[0].innerText;
      }
    },
    ["h1"],
  );
}
