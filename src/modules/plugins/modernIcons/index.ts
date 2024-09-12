import styleText from "./styles.css?inline";

export default async function defineWxtPlugin() {
  defineStPlugin("modernIcons", () => {
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
      ["icon-files", "description"],
      ["icon-schoolbox", "language"],
      ["icon-user", "person"],
    ];

    function insertIcon(className: string, iconName: string) {
      const selectors = [`nav.tab-bar .top-menu .${className}`, `#overflow-nav .${className}`];
      selectors.forEach((selector) => {
        try {
          const icon = document.querySelector(selector);
          // Check if the icon already exists
          if (icon && !icon.querySelector(".material-icons-round")) {
            // console.log(`Inserting icon for ${className} at ${selector}`);
            const iconElement = document.createElement("i");
            iconElement.innerHTML = iconName;
            iconElement.classList.add("material-icons-round");
            icon.insertBefore(iconElement, icon.firstChild);
          }
        } catch (e) {
          // console.error(`Error inserting icon for ${className}: ${e}`);
        }
      });
    }

    injectStyles(styleText);

    icons.forEach(([className, iconName]) => insertIcon(className, iconName));
    setTimeout(() => {
      icons.forEach(([className, iconName]) => insertIcon(className, iconName));
    }, 500);
  });
}
