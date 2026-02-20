import {
  dataAttr,
  injectInlineStyles,
  injectStylesheet,
  setDataAttr,
  uninjectInlineStyles,
  uninjectStylesheet,
} from "@/utils";
import { Plugin } from "@/utils/plugin";
import type { Toggle } from "@/utils/storage";
import type { StorageState } from "@/utils/storage/state.svelte";
import styleText from "./styles.css?inline";

const ID = "modernIcons";
const PLUGIN_ID = `plugin-${ID}`;

export type Settings = {
  filled: StorageState<Toggle>;
};

export default new Plugin<Settings>(
  {
    id: ID,
    name: "Modern Icons",
    description: "Modernise the icons across Schoolbox.",
  },
  true,
  {
    filled: { toggle: true },
  },

  async (settings) => {
    const iconNames = [...new Set(Object.values(icons))].sort();
    const fontUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:FILL@0..1&icon_names=${iconNames.join(",")}`;

    // inject font face
    injectStylesheet(fontUrl, PLUGIN_ID);

    // inject icon styling
    injectInlineStyles(styleText, PLUGIN_ID);

    // inject icons
    injectIcons(icons, settings.filled.state.toggle);
  },
  () => {
    uninjectStylesheet(PLUGIN_ID);
    uninjectInlineStyles(PLUGIN_ID);
    uninjectIcons();
  },
  ["nav.tab-bar .top-menu", "#overflow-nav"],
);

// [className, iconName] (material icons)
const icons = {
  "icon-add": "add",
  "icon-approve": "check_circle",
  "icon-calendar": "calendar_month",
  "icon-canvas-lms": "medical_services",
  "icon-cloudy": "cloud",
  "icon-comment": "translate",
  "icon-course": "class",
  "icon-due-work": "inventory_2",
  "icon-email": "email",
  "icon-eportfolio": "work",
  "icon-files": "description",
  "icon-forms": "check_box",
  "icon-google-drive": "drive_export",
  "icon-group": "group",
  "icon-help": "help",
  "icon-info": "info",
  "icon-lesson-plan": "history_edu",
  "icon-logout": "logout",
  "icon-music": "music_note",
  "icon-news": "newspaper",
  "icon-office-365": "dvr",
  "icon-open": "door_open",
  "icon-podcast": "music_note",
  "icon-reply": "reply",
  "icon-resource-booking": "photo_camera",
  "icon-schoolbox": "language",
  "icon-settings": "settings",
  "icon-staff-students": "account_circle",
  "icon-task": "inventory",
  "icon-teacher": "school",
  "icon-timetable": "schedule",
  "icon-user": "person",
  "icon-video": "videocam",
  "icon-wolfram-alpha": "web",
};

function injectIcons(icons: Record<string, string>, filled: boolean) {
  for (const [className, iconName] of Object.entries(icons)) {
    const selectors = [`nav.tab-bar .top-menu .${className}`, `#overflow-nav .${className}`];

    for (const selector of selectors) {
      const icon = document.querySelector(selector);
      // check if the icon already exists
      if (icon && !icon.querySelector(".material-symbols-rounded")) {
        // logger.info(`inserting icon for ${className} at ${selector}`);
        const iconElement = document.createElement("i");
        iconElement.innerHTML = iconName;
        iconElement.classList.add("material-symbols-rounded");
        iconElement.style.fontVariationSettings = `"FILL" ${filled ? "1" : "0"}`;
        setDataAttr(iconElement, `${PLUGIN_ID}-icon`);
        icon.insertBefore(iconElement, icon.firstChild);
      }
    }
  }
}

function uninjectIcons() {
  const icons = document.querySelectorAll(dataAttr(`${PLUGIN_ID}-icon`));
  for (const icon of icons) {
    icon.parentNode?.removeChild(icon);
  }
}
