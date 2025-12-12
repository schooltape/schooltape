import {
  dataAttr,
  injectInlineStyles,
  injectStylesheet,
  setDataAttr,
  uninjectInlineStyles,
  uninjectStylesheet,
} from "@/utils";
import { Plugin } from "@/utils/plugin";
import styleText from "./styles.css?inline";
import type { Toggle } from "@/utils/storage";
import type { StorageState } from "@/utils/storage/state.svelte";
import menu from "./Menu.svelte?url";

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
    config: {
      filled: { toggle: true },
    },
    menu,
  },

  async (settings) => {
    const iconNames = [...new Set(Object.values(icons))].sort();
    const fontUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:FILL@0..1&icon_names=${iconNames.join(",")}`;

    // inject font face
    injectStylesheet(fontUrl, PLUGIN_ID);

    // inject icon styling
    injectInlineStyles(styleText, PLUGIN_ID);

    // inject icons
    const filled = await settings.filled.get();
    injectIcons(icons, filled.toggle);
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
