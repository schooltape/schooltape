import { browser } from "#imports";
import { flavorEntries } from "@catppuccin/palette";
import { logger } from "./logger";
import type { BackgroundMessage } from "./storage";
import { globalSettings, schoolboxUrls } from "./storage";

export const dataAttr = (id: string) => `[data-schooltape="${id}"]`;
export function setDataAttr(el: HTMLElement, id: string) {
  el.dataset.schooltape = id;
}

export async function onSchoolboxPage(): Promise<boolean> {
  await schoolboxUrls.ready;
  return schoolboxUrls.state.urls.includes(window.location.origin);
}

export const sendMessage = (msg: BackgroundMessage) => browser.runtime.sendMessage(msg);

export function injectInlineStyles(styleText: string, id: string) {
  logger.info(`injecting styles with id ${id}`);
  const style = document.createElement("style");
  style.textContent = styleText;
  setDataAttr(style, `inline-${id}`);
  document.head.appendChild(style);
}

export function uninjectInlineStyles(id: string) {
  logger.info(`uninjecting styles with id ${id}`);
  const style = document.querySelector(dataAttr(`inline-${id}`));
  if (style) document.head.removeChild(style);
}

export async function injectCatppuccin() {
  const flavour = globalSettings.state.themeFlavour;
  const accent = globalSettings.state.themeAccent;

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

export function injectStylesheet(url: string, id: string) {
  // check if stylesheet has already been injected
  const existingLink = document.querySelector(dataAttr(`stylesheet-${id}`));
  if (existingLink) return;

  // inject stylesheet
  logger.info(`injecting stylesheet with id ${id}: ${url}`);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  setDataAttr(link, `stylesheet-${id}`);
  document.head.appendChild(link);
}

export function uninjectStylesheet(id: string) {
  logger.info(`uninjecting stylesheet with id ${id}`);

  const link = document.querySelector(dataAttr(`stylesheet-${id}`));
  if (link) document.head.removeChild(link);
}

export async function injectUserSnippet(id: string) {
  logger.info(`injecting user snippet with id ${id}`);

  const userSnippets = globalSettings.state.userSnippets;
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
  if (document.querySelector(dataAttr(`userSnippet-${id}`))) {
    logger.info(`user snippet with id ${id} already injected, aborting`);
    return;
  }

  // inject user snippet
  const response = await fetch(`https://gist.githubusercontent.com/${snippet.author}/${id}/raw`);
  const css = await response.text();
  const style = document.createElement("style");

  style.textContent = css;
  setDataAttr(style, `userSnippet-${id}`);
  document.head.appendChild(style);

  logger.info(`injected user snippet with id ${id}`);
}

export function uninjectUserSnippet(id: string) {
  logger.info(`uninjecting user snippet with id ${id}`);

  const style = document.querySelector(dataAttr(`userSnippet-${id}`));
  if (!style) return;

  document.head.removeChild(style);
  logger.info(`uninjected user snippet with id ${id}`);
}

export function hasChanged<T>(newValue: T, oldValue: T, keys: (keyof T)[]) {
  const changed: (keyof T)[] = [];

  for (const key in newValue) {
    if (Object.prototype.hasOwnProperty.call(newValue, key) && oldValue[key] !== newValue[key]) {
      changed.push(key);
    }
  }

  return keys.some((item) => changed.includes(item));
}
