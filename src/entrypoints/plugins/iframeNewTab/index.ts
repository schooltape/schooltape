import { Plugin } from "@/utils/plugin";

const ID = "iframeNewTab";
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

function createIframeShortcut(src: string) {
  const shortcut = Object.assign(document.createElement("a"), {
    href: src,
    target: "_blank",
    title: "Open in new tab",
  });

  shortcut.style.cssText = `
    position: absolute;
    top: 6px;
    left: 6px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: hsl(var(--ctp-accent));
    background: rgba(0, 0, 0, 0.5) !important;
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    opacity: 0;
    transition: opacity 0.2s ease, background 0.15s ease;
    z-index: 10;
  `;

  shortcut.innerHTML = ICON_HTML;

  shortcut.addEventListener("mouseenter", () => {
    shortcut.style.background = "rgba(0, 0, 0, 0.75) !important";
  });

  shortcut.addEventListener("mouseleave", () => {
    shortcut.style.background = "rgba(0, 0, 0, 0.5) !important";
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
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      iframe.parentNode?.insertBefore(wrapper, iframe);
      wrapper.appendChild(iframe);

      const shortcut = createIframeShortcut(iframe.src);
      wrapper.appendChild(shortcut);

      wrapper.addEventListener("mouseenter", () => {
        shortcut.style.opacity = "1";
      });
      wrapper.addEventListener("mouseleave", () => {
        shortcut.style.opacity = "0";
      });
    });
  },
  async () => {
    document.querySelectorAll(`a[title="Open in new tab"]`).forEach((shortcut) => {
      shortcut.remove();
    });
  },
  ["iframe"]
);
