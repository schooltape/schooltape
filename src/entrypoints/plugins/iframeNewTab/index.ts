import { injectInlineStyles, uninjectInlineStyles } from "@/utils";
import { Plugin } from "@/utils/plugin";
import styleText from "./styles.css?inline";
import { logger } from "@/utils/logger";

const ID = "iframeNewTab";
const PLUGIN_ID = `plugin-${ID}`;
const SHORTCUT_SELECTOR = `schooltape-${PLUGIN_ID}-shortcut`;
const ICON_HTML = `
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
`;

function createIframeShortcut(href: string) {
  const shortcut = Object.assign(document.createElement("a"), {
    href,
    target: "_blank",
    title: "Open in new tab",
  });

  shortcut.className = SHORTCUT_SELECTOR;
  shortcut.innerHTML = ICON_HTML;

  return shortcut;
}

export default new Plugin(
  {
    id: ID,
    name: "Iframe New Tab",
    description: "Adds a shortcut to open all embedded iframes in a new tab.",
  },
  true,
  null,
  async () => {
    injectInlineStyles(styleText.replaceAll("PLUGIN_ID", PLUGIN_ID), PLUGIN_ID);

    document.querySelectorAll("iframe").forEach((iframe) => {
      const article = iframe.closest("article");
      if (!article) {
        logger.warn(`[${PLUGIN_ID}$] no article found to mount shortcut`);
        return;
      }

      const shortcut = createIframeShortcut(iframe.src);
      article.appendChild(shortcut);

      article.addEventListener("mouseenter", () => {
        shortcut.style.opacity = "1";
      });
      article.addEventListener("mouseleave", () => {
        shortcut.style.opacity = "0";
      });
    });
  },
  async () => {
    uninjectInlineStyles(PLUGIN_ID);

    document.querySelectorAll(SHORTCUT_SELECTOR).forEach((shortcut) => {
      shortcut.remove();
    });
  },
  ["iframe"],
);
