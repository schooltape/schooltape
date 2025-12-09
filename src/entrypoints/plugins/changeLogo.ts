import { dataAttr, injectInlineStyles, setDataAttr, uninjectInlineStyles } from "@/utils";
import { LOGO_INFO } from "@/utils/constants";
import { logger } from "@/utils/logger";
import { definePlugin } from "@/utils/plugin";
import type { LogoInfo } from "@/utils/storage";

const ID = "changeLogo";
const PLUGIN_ID = `plugin-${ID}`;
let oldFavicon: string | undefined;

export default function init() {
  definePlugin(
    ID,
    (settings) => {
      // const logo = LOGO_INFO[settings.themeLogo as LogoId];
      // if (settings?.toggle.setAsFavicon) injectFavicon();
    },
    () => {},
    ["#content", "#footer"],
  );
}

export function injectLogo(logo: LogoInfo, setAsFavicon: boolean): void {
  logger.info(`injecting logo: ${logo.name}`);

  if (logo.disable) return;

  let url = logo.url;
  if (!url.startsWith("http")) {
    // @ts-expect-error unlisted CSS not a PublicPath
    url = browser.runtime.getURL(url);
  }

  const style = document.createElement("style");
  setDataAttr(style, "logo");

  if (logo.adaptive) {
    // for adaptive logos
    style.textContent = `a.logo > img { display: none !important; } a.logo { display: flex; align-items: center; justify-content: center; }`;
    const span = document.createElement("span");
    setDataAttr(span, "logo");
    span.style.mask = `url("${url}") no-repeat center`;
    span.style.maskSize = "100% 100%";
    span.style.backgroundColor = "hsl(var(--ctp-accent))";
    span.style.width = "100%";
    span.style.height = "60px";
    span.style.display = "block";
    window.addEventListener("load", () => {
      document.querySelectorAll("a.logo").forEach((logo) => {
        const clonedSpan = span.cloneNode(true);
        logo.append(clonedSpan);
      });
    });
  } else {
    // for normal logos
    style.textContent = `a.logo > img { content: url("${url}"); max-width: 30%; width: 100px; }`;
  }
  document.head.appendChild(style);
}

function injectFavicon(url: string) {
  // inject favicon
  let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;

  if (!favicon) {
    favicon = document.createElement("link") as HTMLLinkElement;
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }

  oldFavicon = favicon?.href;
  favicon.href = url;
}

function uninjectFavicon() {}

export function uninjectLogo(originalFavicon: string) {
  logger.info("uninjecting logo...");
  for (const el of document.querySelectorAll(dataAttr("logo"))) {
    el.parentElement?.removeChild(el);
  }

  // uninject favicon
  const favicon = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (favicon) favicon.href = originalFavicon;
}
