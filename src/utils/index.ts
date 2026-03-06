import { browser } from "#imports";
import { flavorEntries } from "@catppuccin/palette";
import { logger } from "./logger";
import type { BackgroundMessage } from "./storage";
import { schoolboxUrls, themes } from "./storage";

export const dataAttr = (id: string) => `[data-schooltape="${id}"]`;
export function setDataAttr(el: HTMLElement, id: string) {
  el.dataset.schooltape = id;
}

export async function onSchoolboxPage(): Promise<boolean> {
  return (await schoolboxUrls.get()).urls.includes(window.location.origin);
}

export const sendMessage = (msg: BackgroundMessage) => browser.runtime.sendMessage(msg);

export function injectInlineStyles(styleText: string, id: string) {
  // check if inline styles have already been injected
  if (document.querySelector(dataAttr(`inline-${id}`))) {
    // logger.warn(`existing inline styles with ID: ${id}, aborting...`);
    return;
  }

  logger.info(`injecting inline styles with ID: ${id}`);
  const style = document.createElement("style");
  style.textContent = styleText;
  setDataAttr(style, `inline-${id}`);
  document.head.appendChild(style);
}

export function uninjectInlineStyles(id: string) {
  logger.info(`uninjecting inline styles with ID: ${id}`);
  const style = document.querySelector(dataAttr(`inline-${id}`));
  if (style) document.head.removeChild(style);
}

export async function injectCatppuccin() {
  const { flavour, accent } = await themes.get();

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
  if (document.querySelector(dataAttr(`stylesheet-${id}`))) {
    // logger.warn(`existing stylesheet with ID: ${id}, aborting...`);
    return;
  }

  logger.info(`injecting stylesheet with ID: ${id}`);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  setDataAttr(link, `stylesheet-${id}`);
  document.head.appendChild(link);
}

export function uninjectStylesheet(id: string) {
  logger.info(`uninjecting stylesheet with ID: ${id}`);
  const link = document.querySelector(dataAttr(`stylesheet-${id}`));
  if (link) document.head.removeChild(link);
}
