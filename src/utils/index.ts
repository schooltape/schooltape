import { browser } from "#imports";
import { flavorEntries } from "@catppuccin/palette";
import { logger } from "./logger";
import type { LogoInfo } from "./storage";
import { globalSettings } from "./storage";

export const dataAttr = (id: string) => `[data-schooltape="${id}"]`;
export function setDataAttr(el: HTMLElement, id: string) {
  el.dataset.schooltape = id;
}

export function injectInlineStyles(styleText: string, id: string) {
  logger.info(`injecting styles with id ${id}`);
  const style = document.createElement("style");
  style.textContent = styleText;
  style.dataset.schooltape = `inline-${id}`;
  document.head.append(style);
  // logger.info(`injected styles with id ${id}`);
}

export function uninjectInlineStyles(id: string) {
  logger.info(`uninjecting styles with id ${id}`);
  const style = document.querySelector(dataAttr(`inline-${id}`));
  if (style) document.head.removeChild(style);
}

export function injectCatppuccin() {
  const settings = globalSettings.get();
  const flavour = settings.themeFlavour;
  const accent = settings.themeAccent;

  logger.info(`injecting catppuccin: ${flavour} ${accent}`);
  let styleText = ":root {";
  const flavourArray = flavorEntries.find((entry) => entry[0] === flavour);
  if (flavourArray) {
    flavourArray[1].colorEntries.map(([colorName, { hsl }]) => {
      styleText += `--ctp-${colorName}: ${hsl.h}, ${hsl.s * 100}%, ${hsl.l * 100}%;\n`;
      if (colorName === accent) {
        styleText += `--ctp-accent: ${hsl.h}, ${hsl.s * 100}%, ${hsl.l * 100}%;\n`;
      }
    });
  }
  styleText += "}";
  injectInlineStyles(styleText, "catppuccin");
}

export function uninjectCatppuccin() {
  uninjectInlineStyles("catppuccin");
}

export function injectLogo(logo: LogoInfo, setAsFavicon: boolean) {
  let url = logo.url;
  if (!url.startsWith("http")) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    url = browser.runtime.getURL(url as any);
  }
  logger.info(`injecting logo: ${logo.name}`);
  if (logo.disable) {
    return;
  }
  const style = document.createElement("style");
  style.classList.add("schooltape");
  if (logo.adaptive) {
    style.textContent = `a.logo > img { display: none !important; } a.logo { display: flex; align-items: center; justify-content: center; }`;
    const span = document.createElement("span");
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
    style.textContent = `a.logo > img { content: url("${url}"); max-width: 30%; width: 100px; }`;
  }
  document.head.appendChild(style);

  // inject favicon
  if (setAsFavicon) {
    let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
    if (!favicon) {
      favicon = document.createElement("link") as HTMLLinkElement;
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = url;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function injectStylesheet(url: any, id: string) {
  // check if stylesheet has already been injected
  const existingLink = document.querySelector(dataAttr(`stylesheet-${id}`));
  if (existingLink) return;

  // inject stylesheet
  logger.info(`injecting stylesheet with id ${id}: ${url}`);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  link.dataset.schooltape = `stylesheet-${id}`;
  document.head.appendChild(link);
}

export function uninjectStylesheet(id: string) {
  logger.info(`uninjecting stylesheet with id ${id}`);

  const link = document.querySelector(dataAttr(`stylesheet-${id}`));
  if (link) document.head.removeChild(link);
}

export function injectUserSnippet(id: string) {
  logger.info(`injecting user snippet with id ${id}`);

  const userSnippets = globalSettings.get().userSnippets;
  const snippet = userSnippets[id];

  if (!snippet) {
    logger.error(`user snippet with id ${id} not found, aborting`);
    return;
  }

  if (!snippet.toggle) {
    logger.error(`trying to inject user snippet with id ${id} which is disabled, aborting`);
    return;
  }

  // check not already injected
  const style = document.querySelector(`userSnippet-${id}`);
  if (style) {
    logger.info(`user snippet with id ${id} already injected, aborting`);
    return;
  }

  // inject user snippet
  fetch(`https://gist.githubusercontent.com/${snippet.author}/${id}/raw`)
    .then((response) => response.text())
    .then((css) => {
      const style = document.createElement("style");
      style.textContent = css;
      style.dataset.schooltape = `userSnippet-${id}`;
      document.head.appendChild(style);
      logger.info(`injected user snippet with id ${id}`);
    });
}

export function uninjectUserSnippet(id: string) {
  logger.info(`uninjecting user snippet with id ${id}`);
  const style = document.querySelector(`userSnippet-${id}`);
  if (style) {
    document.head.removeChild(style);
    logger.info(`uninjected user snippet with id ${id}`);
  } else {
    // logger.warn(`user snippet with id ${id} not found, aborting`)
  }
}

export function hasChanged<T extends Record<string, any>>(newValue: T, oldValue: T, keys: (keyof T)[]) {
  const changed: (keyof T)[] = [];

  for (const key in newValue) {
    if (newValue.hasOwnProperty(key) && oldValue[key] !== newValue[key]) {
      changed.push(key);
    }
  }

  return keys.some((item) => changed.includes(item));
}
