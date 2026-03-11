import { Plugin } from "@/utils/plugin";

const ID = "iframeNewTab";
const ICON_HTML = `
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
`;

function createIframeShortcut(src: string) {
  const shortcut = Object.assign(document.createElement("a"), {
    href: src,
    target: "_blank",
    title: "Open in new tab",
  });

  shortcut.innerHTML = ICON_HTML;
  const icon = shortcut.firstElementChild as SVGElement | null;
  if (!icon) return shortcut;

  icon.style.cssText = `
    color: hsl(var(--ctp-accent));
    cursor: pointer;
    transition: opacity 0.2s ease;
    vertical-align: middle;
    margin-left: 0.5rem;
    margin-top: -0.25rem;
  `;

  shortcut.addEventListener("mouseenter", () => {
    icon.style.opacity = "0.7";
  });

  shortcut.addEventListener("mouseleave", () => {
    icon.style.opacity = "1";
  });

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
    document.querySelectorAll("iframe").forEach((iframe) => {
      const iframeHeader = iframe.parentElement?.parentElement?.parentElement?.parentElement?.querySelector("h2"); // abomination
      if (!iframeHeader) return;

      iframeHeader.appendChild(createIframeShortcut(iframe.src));
    });
  },
  async () => {
    document.querySelectorAll(`a[title="Open in new tab"]`).forEach((shortcut) => {
      shortcut.remove();
    });
  },
  ["iframe"]
);
