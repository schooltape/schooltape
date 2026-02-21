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
  return (await schoolboxUrls.get()).urls.includes(window.location.origin);
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
  const settings = await globalSettings.get();
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

export function hasChanged<T>(newValue: T, oldValue: T, keys: (keyof T)[]) {
  const changed: (keyof T)[] = [];

  for (const key in newValue) {
    if (Object.prototype.hasOwnProperty.call(newValue, key) && oldValue[key] !== newValue[key]) {
      changed.push(key);
    }
  }

  return keys.some((item) => changed.includes(item));
}
