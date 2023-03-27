/*
For developers:
Please read the Contributing guidelines here --> https://github.com/schooltape/schooltape/blob/main/CONTRIBUTING.md
*/

// NOTE: This code needs to be re-written

const modernIconsConsole = "color: green; font-weight: bold;";
console.log(`%c[modern-icons.js]`, modernIconsConsole, "Injected modern-icons.js!");


// insertIcon(className, iconName, assignRefreshClass);
insertIcon("icon-teacher", "school");
insertIcon("icon-due-work", "inventory_2");
insertIcon("icon-task", "inventory");
insertIcon("icon-timetable", "schedule");
insertIcon("icon-calendar", "calendar_month");
insertIcon("icon-news", "feed");
insertIcon("icon-email", "email");
insertIcon("icon-wolfram-alpha", "web");
insertIcon("icon-comment", "translate");
insertIcon("icon-canvas-lms", "medical_services");
insertIcon("icon-video", "videocam");
insertIcon("icon-office-365", "dvr");
insertIcon("icon-google-drive", "cloud_upload");
insertIcon("icon-help", "help");
insertIcon("icon-music", "audiotrack");
insertIcon("icon-staff-students", "account_circle");
insertIcon("icon-settings", "settings");
insertIcon("icon-logout", "logout");
insertIcon("icon-course", "class");
insertIcon("icon-reply", "reply");

insertIcon('icon-approve', 'check_circle', true);
insertIcon('icon-notifications', 'notifications_none', true);

setInterval(autoInsertIcons,3000); // Updates every three seconds
injectCSS();

// This function automatically refreshes icons
function autoInsertIcons() {
  const refreshClassElements = document.querySelectorAll('.auto-refresh-icon');
  refreshClassElements.forEach(elements => {
    elements.remove();
  });
  // insertIcon(className, iconName, assignRefreshClass);
  insertIcon('icon-approve', 'check_circle', true);
  insertIcon('icon-notifications', 'notifications_none', true);
  // insertIcon("icon-favourite-hollow", "bookmark_border", true);
}

// Define function
function insertIcon(className, iconName, assignRefreshClass) {
  try {
    for (let i = 0; i < document.getElementsByClassName(className).length; i++) {
      const ICON_MAIN = document.getElementsByClassName(className)[i];
      let iconElement = document.createElement("i");
      iconElement.innerHTML = iconName;
      iconElement.classList.add("material-icons-round");
      if (assignRefreshClass === true) {
        iconElement.classList.add("auto-refresh-icon");
      }
      if (iconName === "notifications_none") {
        let notifToggleElement = document.getElementById("notification-toggle");
        let unreadValue = notifToggleElement.getAttribute("data-unread");
        if (unreadValue !== "0") {
          iconElement.classList.add("unread-notif");
          iconElement.innerHTML = "notifications";
        }
      }
      ICON_MAIN.insertBefore(iconElement, ICON_MAIN.firstChild);
    }
  }
  catch (error) {
  }
}

function injectCSS() {
  // Inject CSS
  let link = document.createElement("link");
  link.href = chrome.runtime.getURL("/Plugins/modern-icons/modern-icons.css");
  link.type = "text/css";
  link.rel = "stylesheet";
  // Adds the class schooltape-css
  link.className = "schooltape-css";
  document.getElementsByTagName("head")[0].appendChild(link);
  console.log(`%c[modern-icons.js]`, modernIconsConsole, "Injected modern-icons.css")
}