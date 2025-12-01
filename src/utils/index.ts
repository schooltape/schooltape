import { browser } from "#imports";
import { flavorEntries } from "@catppuccin/palette";
import { logger } from "./logger";
import { globalSettings } from "./storage";
import type { LogoInfo } from "./storage";

// TODO: uninjectStyles
export function injectStyles(styleText: string) {
  logger.info(`injecting styles`);
  const style = document.createElement("style");
  style.textContent = styleText;
  style.classList.add("schooltape");
  document.head.append(style);
}

export function injectCatppuccin(flavour: string, accent: string) {
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
  injectStyles(styleText);
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
  const existingLink = document.querySelector(`link[data-schooltape="${id}"]`);
  if (existingLink) {
    logger.info(`stylesheet with id ${id} already injected, aborting`);
    return;
  }

  // inject stylesheet
  logger.info(`injecting stylesheet with id ${id}: ${url}`);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = browser.runtime.getURL(url);
  link.dataset.schooltape = id;
  document.head.appendChild(link);
}

export function uninjectStylesheet(id: string) {
  logger.info(`uninjecting stylesheet with id ${id}`);
  const link = document.querySelector(`link[data-schooltape="${id}"]`);
  if (link) {
    document.head.removeChild(link);
  } else {
    // logger.warn(`stylesheet with id ${id} not found, aborting`);
  }
}

export function injectUserSnippet(id: string) {
  logger.info(`injecting user snippet with id ${id}`);

  const userSnippets = globalSettings.get().userSnippets;
  const snippet = userSnippets[id];

  if (!snippet) {
    logger.error(`user snippet with id ${id} not found, aborting`);
    return;
  }

  if (snippet.toggle === true) {
    // check not already injected
    const style = document.querySelector(`style[data-schooltape="userSnippet-${id}"]`);
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
}

export function uninjectUserSnippet(id: string) {
  logger.info(`uninjecting user snippet with id ${id}`);
  const style = document.querySelector(`style[data-schooltape="userSnippet-${id}"]`);
  if (style) {
    document.head.removeChild(style);
    logger.info(`uninjected user snippet with id ${id}`);
  } else {
    // logger.warn(`user snippet with id ${id} not found, aborting`)
  }
}

function getChangedValues<T extends Record<string, any>>(newValue: T, oldValue: T) {
  const changedKeys = [];

  for (const key in newValue) {
    if (newValue.hasOwnProperty(key) && oldValue[key] !== newValue[key]) {
      changedKeys.push(key);
    }
  }

  return changedKeys;
}

function includesSome(array: string[], items: string[]) {
  return items.some((item) => array.includes(item));
}

export function hasChanged<T extends Record<string, any>>(newValue: T, oldValue: T, keys: string[]) {
  const changed = getChangedValues(newValue, oldValue);
  return includesSome(changed, keys);
}
