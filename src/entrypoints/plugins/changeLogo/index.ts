import { browser } from "#imports";
import { dataAttr, setDataAttr } from "@/utils";
import { logger } from "@/utils/logger";
import { Plugin } from "@/utils/plugin";
import { globalSettings } from "@/utils/storage";
import type { Toggle } from "@/utils/storage";
import type { StorageState } from "@/utils/storage/state.svelte";
import schoolbox from "/schoolbox.svg?raw";
import { flavors } from "@catppuccin/palette";

const ID = "changeLogo";
let originalFavicon: string | undefined;
export const logos = buildLogos({
  schooltape: {
    name: "Schooltape",
    url: "schooltape.svg",
  },
  "schooltape-rainbow": {
    name: "ST Rainbow",
    url: "schooltape-ctp.svg",
  },
  "schooltape-legacy": {
    name: "ST Legacy",
    url: "https://schooltape.github.io/schooltape-legacy.svg",
  },
  catppuccin: {
    name: "Catppuccin",
    url: "https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png",
  },
  schoolbox: {
    name: "Schoolbox",
    raw: schoolbox,
  },
});

export type Settings = {
  setAsFavicon: StorageState<Toggle>;
  logo: StorageState<{ id: keyof Awaited<typeof logos> }>;
};

interface LogoInfo {
  name: string;
  url: string;
}
type ImageSource = { name: string; url: string; raw?: never } | { name: string; url?: never; raw: string };

export default new Plugin<Settings>(
  {
    id: ID,
    name: "Change Logo",
    description: "Changes the Schoolbox logo to a logo of your choice.",
  },
  true,
  {
    setAsFavicon: { toggle: false },
    logo: { id: "schooltape-rainbow" },
  },
  async (settings) => {
    const resolvedLogos = await logos;
    const logoId = (await settings.logo.get()).id;
    injectLogo(resolvedLogos[logoId]);
    if ((await settings.setAsFavicon.get()).toggle) injectFavicon(resolvedLogos[logoId]);
  },
  () => {
    uninjectLogo();
    uninjectFavicon();
  },
  [".logo"],
);

function injectLogo(logo: LogoInfo): void {
  logger.info(`injecting logo: ${logo.name}`);

  const style = document.createElement("style");
  setDataAttr(style, "logo");

  style.textContent = `a.logo > img { content: url("${logo.url}"); max-width: 30%; width: 100px; }`;
  document.head.appendChild(style);
}

function uninjectLogo() {
  logger.info("uninjecting logo...");
  for (const el of document.querySelectorAll(dataAttr("logo"))) {
    el.parentElement?.removeChild(el);
  }
}

function injectFavicon(logo: LogoInfo) {
  logger.info(`injecting favicon: ${logo.name}`);

  let favicon = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;

  if (!favicon) {
    favicon = document.createElement("link") as HTMLLinkElement;
    favicon.rel = "icon";
    document.head.appendChild(favicon);
  }

  originalFavicon = favicon?.href;
  favicon.href = logo.url;
}

function uninjectFavicon() {
  logger.info("uninjecting favicon...");
  const favicon = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (favicon && originalFavicon) favicon.href = originalFavicon;
}

async function buildLogos<T extends Record<string, ImageSource>>(logos: T): Promise<Record<keyof T, LogoInfo>> {
  const output: Record<keyof T, LogoInfo> = {} as Record<keyof T, LogoInfo>;

  for (const [key, value] of Object.entries(logos) as [keyof T, ImageSource][]) {
    let url;

    if (value.url) {
      if (value.url.startsWith("http")) {
        url = value.url;
      } else {
        // @ts-expect-error unlisted CSS not a PublicPath
        url = browser.runtime.getURL(value.url);
      }
    } else if (value.raw) {
      const settings = await globalSettings.get();
      const flavour = settings.themeFlavour;
      const accent = settings.themeAccent;
      const accentHex = flavors[flavour].colors[accent].hex;
      url = `data:image/svg+xml;utf8,${encodeURIComponent(value.raw.replaceAll("currentColor", accentHex))}`;
    }

    if (!url) throw new Error("error getting URL for logo");

    output[key] = {
      name: value.name,
      url,
    };
  }

  return output;
}
