import { flavors, flavorEntries } from "@catppuccin/palette";

export function injectStyles(styleText: string) {
  logger.info(`[content-utils] Injecting styles: ${styleText}`);
  const style = document.createElement("style");
  style.textContent = styleText;
  style.classList.add("schooltape");
  document.head.append(style);
}

export function injectCatppuccin(flavour: string, accent: string) {
  logger.info(`[content-utils] Injecting Catppuccin: ${flavour} ${accent}`);
  let styleText = "";
  const flavourArray = flavorEntries.find((entry) => entry[0] === flavour);
  if (flavourArray) {
    flavourArray[1].colorEntries.map(([colorName, { hsl }]) => {
      styleText += `:root { --ctp-${colorName}: ${hsl.h} ${hsl.s * 100}% ${hsl.l * 100}%; }\n`;
      if (colorName === accent) {
        styleText += `:root { --ctp-accent: ${hsl.h} ${hsl.s * 100}% ${hsl.l * 100}%; }\n`;
      }
    });
  }
  injectStyles(styleText);
}

export function injectLogo(logo: LogoDetails) {
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

export async function injectSnippets() {
  logger.info("[content-utils] Injecting snippets");
  // inbuilt snippets
  const snippets = await snippetSettings.getValue();
  const populatedSnippets = populateItems(snippets.snippets, SNIPPET_INFO, "snippet");
  populatedSnippets.forEach((snippet) => {
    if (snippet.toggle) {
      injectStylesheet(`/snippets/${snippet.id}.css`);
    }
  });
  // user snippets
  for (let snippetID in snippets.user) {
    let userSnippet = snippets.user[snippetID];
    if (userSnippet.toggle) {
      fetch(`https://gist.githubusercontent.com/${userSnippet.author}/${snippetID}/raw`)
        .then((response) => response.text())
        .then((css) => {
          let style = document.createElement("style");
          style.textContent = css;
          style.classList.add("schooltape");
          document.head.appendChild(style);
        });
    }
  }
}

// This is used in Plugins.svelte and Snippets.svelte to populate the items in the list
type ItemType = "plugin" | "snippet";
// Define a generic function with a conditional return type
export function populateItems<T extends ItemType>(
  data: Record<string, PluginData> | Record<string, SnippetData>,
  info: Record<string, PluginInfo> | Record<string, SnippetInfo>,
  type: T,
): T extends "plugin" ? PopulatedPlugin[] : PopulatedSnippet[] {
  // console.log(data, info, type);
  return Object.entries(info)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([key, value]) => {
      // console.log(key, value);
      // console.log(data[key]);
      if (type === "plugin") {
        const populatedItem: PopulatedPlugin = {
          id: key,
          ...value,
          ...data[key],
        };
        if (data.settings) {
          populatedItem.settings = data.settings;
        }
        return populatedItem;
      } else {
        const populatedItem: PopulatedSnippet = {
          id: key,
          ...value,
          ...data[key],
        };
        return populatedItem;
      }
    });
}
