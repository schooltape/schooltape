/*
For developers:
Please read the Contributing guidelines here --> https://github.com/schooltape/schooltape/blob/main/CONTRIBUTING.md
*/

const icons = [ // [className, iconName] (material icons)
  ["icon-teacher", "school"],
  ["icon-due-work", "inventory_2"],
  ["icon-task", "inventory"],
  ["icon-timetable", "schedule"],
  ["icon-calendar", "calendar_month"],
  ["icon-news", "feed"],
  ["icon-email", "email"],
  ["icon-wolfram-alpha", "web"],
  ["icon-comment", "translate"],
  ["icon-canvas-lms", "medical_services"],
  ["icon-video", "videocam"],
  ["icon-office-365", "dvr"],
  ["icon-google-drive", "cloud_upload"],
  ["icon-help", "help"],
  ["icon-music", "audiotrack"],
  ["icon-staff-students", "account_circle"],
  ["icon-settings", "settings"],
  ["icon-logout", "logout"],
  ["icon-course", "class"],
  ["icon-reply", "reply"],
  ["icon-approve", "check_circle"],
  ["icon-forms", "description"],
  ["icon-group", "group"],
  ["icon-info", "info"],
  ["icon-resource-booking", "book_online"],
  // ["icon-approve", "check_circle", true],
  // ["icon-notifications", "notifications_none", true],
];

const modernIconsConsole = "color: green; font-weight: bold;";

icons.forEach(([className, iconName, assignRefreshClass]) => insertIcon(className, iconName, assignRefreshClass));
// setInterval(autoInsertIcons, 1000);
injectCSS();

function insertIcon(className, iconName, assignRefreshClass) {
  try {
    const ICON_MAIN = document.querySelector(`nav.tab-bar .top-menu .${className}`);
    // console.log(ICON_MAIN);
    const iconElement = document.createElement("i");
    iconElement.innerHTML = iconName;
    iconElement.classList.add("material-icons-round");
    ICON_MAIN.insertBefore(iconElement, ICON_MAIN.firstChild);
  } catch (e) {
    // console.log(`%c[modern-icons.js]`, modernIconsConsole, `Failed to insert icon for ${className}`);
  }
  try {
    const ICON_MAIN = document.querySelector(`#overflow-nav .${className}`);
    // console.log(ICON_MAIN);
    const iconElement = document.createElement("i");
    iconElement.innerHTML = iconName;
    iconElement.classList.add("material-icons-round");
    ICON_MAIN.insertBefore(iconElement, ICON_MAIN.firstChild);
  } catch (e) {
    // console.log(`%c[modern-icons.js]`, modernIconsConsole, `Failed to insert icon for ${className}`);
  }
}

function injectCSS() {
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("/plugins/modern-icons/modern-icons.css");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.className = "schooltape-css";
  document.head.appendChild(link);
}