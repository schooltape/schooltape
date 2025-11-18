import { browser, defineContentScript } from "#imports";
import { injectCatppuccin, injectLogo, injectStylesheet, injectUserSnippets } from "@/utils";
import { EXCLUDE_MATCHES, LOGO_INFO } from "@/utils/constants";
import type { LogoId } from "@/utils/storage";
import { globalSettings, schoolboxUrls } from "@/utils/storage";
import cssUrl from "./catppuccin.css?url";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "manual",
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    const settings = await globalSettings.storage.getValue();
    const urls = (await schoolboxUrls.storage.getValue()).urls;

    if (settings.global && urls.includes(window.location.origin)) {
      // inject themes
      if (settings.themes) {
        injectStylesheet(cssUrl);
        injectCatppuccin(settings.themeFlavour, settings.themeAccent);
      }

      // inject logo
      injectLogo(LOGO_INFO[settings.themeLogo as LogoId], settings.themeLogoAsFavicon);

      // inject snippets
      if (settings.snippets) {
        injectUserSnippets(settings.userSnippets);
      }

      // update icon
      browser.runtime.sendMessage({ updateIcon: true });
    }
  },
});
