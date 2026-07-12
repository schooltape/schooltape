import { injectInlineStyles, injectStylesheet, setDataAttr, uninjectInlineStyles, uninjectStylesheet } from "@/utils";
import { Plugin } from "@/utils/plugin";
import type { Toggle } from "@/utils/storage";
import type { StorageState } from "@/utils/storage/state.svelte";
import styleText from "./styles.css?inline";

const ID = "modernIcons";
const PLUGIN_ID = `plugin-${ID}`;
const fontUrl = `https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:FILL@0..1`;
const injectedIcons: HTMLElement[] = [];
const injectedLinks: HTMLLinkElement[] = [];
const hiddenSvgs: SVGElement[] = [];

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
    // inject font face
    injectStylesheet(fontUrl, PLUGIN_ID);

    // inject icon styling
    injectInlineStyles(styleText, PLUGIN_ID);

    // inject icons
    const filled = await settings.filled.get();
    injectIcons(filled.toggle);
  },
  () => {
    uninjectStylesheet(PLUGIN_ID);
    uninjectInlineStyles(PLUGIN_ID);
    uninjectIcons();
  },
  ["nav.tab-bar .top-menu", "#overflow-nav"],
);

// stIconId: sbxIconIds[] (material icons)
const iconMap: Record<string, string[]> = {
  check_circle: ["approve"],
  calendar_month: ["calendar"],
  medical_services: ["canvas-lms"],
  cloud: ["cloudy"],
  translate: ["comment"],
  class: ["course"],
  inventory_2: ["due-work"],
  work: ["eportfolio"],
  description: ["files"],
  check_box: ["forms"],
  history_edu: ["lesson-plan"],
  music_note: ["music", "podcast"],
  newspaper: ["news"],
  dvr: ["office-365"],
  door_open: ["open"],
  photo_camera: ["resource-booking"],
  language: ["schoolbox"],
  account_circle: ["staff-students"],
  inventory: ["task"],
  school: ["teacher"],
  schedule: ["timetable"],
  person: ["user"],
  videocam: ["video"],
  web: ["wolfram-alpha"],
};

// TODO icon text overrides
/**
 * this is applied after the icon map to override weird decisions
 * by school IT admins by searching for regex patterns in titles
 * [stIconId, sbxIconTitleRegexes[]]
 */
// TODO si: brand icons prefix
// const overrideMap: Record<string, RegExp[]> = {
//   "si:gemini": [/Gemini/i],
//   "si:notebooklm": [/^Notebook ?LM$/i],
//   design_services: [/^Canva$/i],
//   qr_code: [/QR Code/i],
//   translate: [/^(EP|Education Perfect)$/i],
//   health_cross: [/Health/i],
// };

function injectIcons(filled: boolean) {
  for (const [stIconId, sbxIconIds] of Object.entries(iconMap))
    for (const nav of ["#top-menu", "#overflow-nav"]) {
      for (const sbxIconId of sbxIconIds) {
        const sbxIcon = document.querySelector(nav)!.querySelector(`sbx-icon[name=${sbxIconId}]`);
        const shadowRoot = sbxIcon?.shadowRoot;
        const slot = shadowRoot?.querySelector("span > slot");
        const svg = slot?.querySelector("svg");

        if (slot == null || svg == null || sbxIcon == null || shadowRoot == null) continue;

        // inject icon
        const icon = document.createElement("i");
        icon.innerHTML = stIconId;
        icon.classList.add("material-symbols-rounded");
        icon.style.fontVariationSettings = `"FILL" ${filled ? "1" : "0"}`;
        setDataAttr(icon, `${PLUGIN_ID}-icon`);
        slot.insertBefore(icon, slot.firstChild);
        injectedIcons.push(icon);

        // inject stylesheet into shadow root
        // TODO: investigate why this is needed in conjunction with global stylesheet
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = fontUrl;
        setDataAttr(link, `stylesheet-${PLUGIN_ID}`);
        shadowRoot.appendChild(link);
        injectedLinks.push(link);

        // hide old icon
        svg.style.display = "none";
        hiddenSvgs.push(svg);
      }
    }
}

function uninjectIcons() {
  while (injectedIcons.length > 0) {
    const icon = injectedIcons.pop();
    icon?.remove();
  }
  while (injectedLinks.length > 0) {
    const link = injectedLinks.pop();
    link?.remove();
  }
  while (hiddenSvgs.length > 0) {
    const svg = hiddenSvgs.pop();
    if (svg) svg.style.display = "block";
  }
}
