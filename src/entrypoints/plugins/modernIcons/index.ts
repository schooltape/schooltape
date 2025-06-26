import styleText from "./styles.css?inline";

export default function init() {
  defineStPlugin(
    "modernIcons",
    async (_id, data) => {
      // [className, iconName] (material icons)
      const icons = {
        "icon-teacher": "school",
        "icon-due-work": "inventory_2",
        "icon-task": "inventory",
        "icon-timetable": "schedule",
        "icon-calendar": "calendar_month",
        "icon-news": "newspaper",
        "icon-email": "email",
        "icon-wolfram-alpha": "web",
        "icon-comment": "translate",
        "icon-canvas-lms": "medical_services",
        "icon-video": "videocam",
        "icon-office-365": "dvr",
        "icon-google-drive": "drive_export",
        "icon-help": "help",
        "icon-podcast": "music_note",
        "icon-music": "music_note",
        "icon-staff-students": "account_circle",
        "icon-settings": "settings",
        "icon-logout": "logout",
        "icon-course": "class",
        "icon-reply": "reply",
        "icon-approve": "check_circle",
        "icon-forms": "check_box",
        "icon-group": "group",
        "icon-info": "info",
        "icon-resource-booking": "photo_camera",
        "icon-files": "description",
        "icon-schoolbox": "language",
        "icon-user": "person",
        "icon-cloudy": "cloud",
        "icon-eportfolio": "work",
        "icon-open": "door_open",
      };

      function insertIcon(className: string, iconName: string, fill: boolean) {
        const selectors = [`nav.tab-bar .top-menu .${className}`, `#overflow-nav .${className}`];
        selectors.forEach((selector) => {
          const icon = document.querySelector(selector);
          // Check if the icon already exists
          if (icon && !icon.querySelector(".material-symbols-rounded")) {
            // console.log(`Inserting icon for ${className} at ${selector}`);
            const iconElement = document.createElement("i");
            iconElement.innerHTML = iconName;
            iconElement.classList.add("material-symbols-rounded");
            iconElement.style.fontVariationSettings = `"FILL" ${fill ? "1" : "0"}`;
            icon.insertBefore(iconElement, icon.firstChild);
          }
        });
      }

      let fontFill = true;

      const filled = await data.settings?.toggle?.filled?.toggle?.storage?.getValue();
      if (filled?.toggle !== undefined) {
        fontFill = filled.toggle;
      }

      const iconNames = [...new Set(Object.values(icons))].sort();
      const fontUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:FILL@0..1&icon_names=${iconNames.join(",")}`;
      // console.log(fontUrl);

      // inject font face
      const style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = fontUrl;
      style.type = "text/css";
      document.head.appendChild(style);

      injectStyles(styleText);

      for (const [className, iconName] of Object.entries(icons)) {
        insertIcon(className, iconName, fontFill);
      }
    },
    ["nav.tab-bar .top-menu", "#overflow-nav"],
  );
}
