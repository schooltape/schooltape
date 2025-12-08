import { browser, defineContentScript } from "#imports";
import {
  hasChanged,
  injectCatppuccin,
  injectLogo,
  injectStylesheet,
  injectUserSnippet,
  uninjectCatppuccin,
  uninjectStylesheet,
  uninjectUserSnippet,
} from "@/utils";
import { EXCLUDE_MATCHES, LOGO_INFO } from "@/utils/constants";
import type { LogoId, Settings } from "@/utils/storage";
import { globalSettings, schoolboxUrls } from "@/utils/storage";
import type { WatchCallback } from "wxt/utils/storage";
import cssUrl from "./catppuccin.css?url";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "manual",
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    const settings = await globalSettings.storage.getValue();
    const urls = (await schoolboxUrls.storage.getValue()).urls;

    const updateThemes: WatchCallback<Settings> = (newValue, oldValue) => {
      // if global or themes was changed
      if (hasChanged(newValue, oldValue, ["global", "themes", "themeFlavour", "themeAccent"])) {
        if (newValue.global && newValue.themes) {
          injectThemes();
          injectCatppuccin();
        } else {
          uninjectThemes();
          uninjectCatppuccin();
        }
      }
    };

    const updateUserSnippets: WatchCallback<Settings> = (newValue, oldValue) => {
      // if global or userSnippets were changed
      if (hasChanged(newValue, oldValue, ["global", "userSnippets"])) {
        for (const [id, userSnippet] of Object.entries(newValue.userSnippets)) {
          if (newValue.global && newValue.snippets && userSnippet.toggle) {
            injectUserSnippet(id);
          } else {
            uninjectUserSnippet(id);
          }
        }
      }
    };

    // @ts-expect-error unlisted CSS not a PublicPath
    const injectThemes = () => injectStylesheet(browser.runtime.getURL(cssUrl), "themes");
    const uninjectThemes = () => uninjectStylesheet("themes");

    // storage listeners for hot reload
    globalSettings.storage.watch((newValue, oldValue) => {
      updateThemes(newValue, oldValue);
      updateUserSnippets(newValue, oldValue);
    });

    if (settings.global && urls.includes(window.location.origin)) {
      // inject themes
      if (settings.themes) {
        injectThemes();
        injectCatppuccin();
      }

      // inject logo
      injectLogo(LOGO_INFO[settings.themeLogo as LogoId], settings.themeLogoAsFavicon);

      // inject user snippets
      if (settings.snippets) {
        const userSnippets = globalSettings.get().userSnippets;
        for (const [id, snippet] of Object.entries(userSnippets)) {
          if (snippet.toggle) {
            injectUserSnippet(id);
          }
        }
      }

      // update icon
      browser.runtime.sendMessage({ updateIcon: true });
    }
  },
});
