import { flavors, flavorEntries } from "@catppuccin/palette";
import { WxtStorageItem } from "wxt/storage";

export async function populateItems<T extends ItemId>(
  storage: Record<T, WxtStorageItem<ItemGeneric, any>>,
  info: Record<T, ItemInfo>,
): Promise<PopulatedItem<T>[]> {
  const populatedItems: PopulatedItem<T>[] = [];

  for (const itemId of Object.keys(storage) as T[]) {
    const item = storage[itemId].fallback;
    const itemInfo = info[itemId];

    const populatedItem: PopulatedItem<T> = {
      id: itemId,
      ...item,
      ...itemInfo,
      toggle: false,
    };

    const storedItem = await storage[itemId].getValue();
    populatedItem.toggle = storedItem.toggle;

    populatedItems.push(populatedItem);
  }

  return populatedItems;
}

export async function toggleItem<T extends ItemId>(
  storage: Record<T, WxtStorageItem<ItemGeneric, any>>,
  itemId: T,
  toggled: boolean,
): Promise<void> {
  const item = await storage[itemId].getValue();
  if (item) {
    item.toggle = toggled;
    await storage[itemId].setValue(item);
    await needsRefresh.setValue(true);
    logger.info(`Toggled ${itemId} to ${toggled}`);
  } else {
    logger.error(`Failed to toggle ${itemId}, not found in storage`);
  }
}

export function injectStyles(styleText: string) {
  logger.info(`[content-utils] Injecting styles: ${styleText}`);
  const style = document.createElement("style");
  style.textContent = styleText;
  style.classList.add("schooltape");
  document.head.append(style);
}

export function injectCatppuccin(flavour: string, accent: string) {
  logger.info(`[content-utils] Injecting Catppuccin: ${flavour} ${accent}`);
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

export function injectLogo(logo: LogoInfo) {
  let url = logo.url;
  if (!url.startsWith("http")) {
    url = browser.runtime.getURL(url as any);
  }
  logger.info(`[content-utils] Injecting Logo: ${logo.name}`);
  if (logo.disable) {
    return;
  }
  let style = document.createElement("style");
  style.classList.add("schooltape");
  if (logo.adaptive) {
    style.textContent = `a.logo > img { display: none !important; } a.logo { display: flex; align-items: center; justify-content: center; }`;
    let span = document.createElement("span");
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
    style.textContent = `a.logo > img { content: url("${url}"); max-width: 30%; }`;
  }
  document.head.appendChild(style);
}

export function injectStylesheet(url: any) {
  logger.info(`[content-utils] Injecting stylesheet: ${url}`);
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = browser.runtime.getURL(url);
  link.classList.add("schooltape");
  document.head.appendChild(link);
}

export async function injectUserSnippets(userSnippets: Record<string, UserSnippet>) {
  logger.info("[content-utils] Injecting snippets");
  // user snippets
  Object.keys(userSnippets).forEach((snippetId) => {
    let userSnippet = userSnippets[snippetId];
    if (userSnippet.toggle) {
      fetch(`https://gist.githubusercontent.com/${userSnippet.author}/${snippetId}/raw`)
        .then((response) => response.text())
        .then((css) => {
          let style = document.createElement("style");
          style.textContent = css;
          style.classList.add("schooltape");
          document.head.appendChild(style);
        });
    }
  });
}
