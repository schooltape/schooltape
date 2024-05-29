// [className, iconName] (material icons)
const icons = [
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
];

function insertIcon(className, iconName) {
  const selectors = [`nav.tab-bar .top-menu .${className}`, `#overflow-nav .${className}`];
  selectors.forEach((selector) => {
    try {
      const ICON_MAIN = document.querySelector(selector);
      // Check if the icon already exists
      if (!ICON_MAIN.querySelector(".material-icons-round")) {
        // console.log(`Inserting icon for ${className} at ${selector}`);
        const iconElement = document.createElement("i");
        iconElement.innerHTML = iconName;
        iconElement.classList.add("material-icons-round");
        ICON_MAIN.insertBefore(iconElement, ICON_MAIN.firstChild);
      }
    } catch (e) {
      // console.error(`Error inserting icon for ${className}: ${e}`);
    }
  });
}

injectCSS();
icons.forEach(([className, iconName]) => insertIcon(className, iconName));
setTimeout(() => {
  icons.forEach(([className, iconName]) => insertIcon(className, iconName));
}, 500);

function injectCSS() {
  const link = document.createElement("link");
  link.href = chrome.runtime.getURL("/plugins/modern-icons/modern-icons.css");
  link.type = "text/css";
  link.rel = "stylesheet";
  // TODO: Hot reload
  link.className = "schooltape-css";
  document.head.appendChild(link);
}
