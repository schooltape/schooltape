import { browser, defineContentScript } from "#imports";
import {
  injectCatppuccin,
  injectLogo,
  injectStylesheet,
  uninjectStylesheet,
  injectUserSnippet,
  uninjectUserSnippet,
  hasChanged,
} from "@/utils";
import { EXCLUDE_MATCHES, LOGO_INFO } from "@/utils/constants";
import type { LogoId, Settings } from "@/utils/storage";
import { globalSettings, schoolboxUrls } from "@/utils/storage";
import cssUrl from "./catppuccin.css?url";
import { WatchCallback } from "wxt/utils/storage";

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
      if (hasChanged(newValue, oldValue, ["global", "themes"])) {
        if (newValue.global && newValue.themes) {
          injectThemes();
        } else {
          uninjectThemes();
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

    const injectThemes = () => injectStylesheet(cssUrl, "themes");
    const uninjectThemes = () => uninjectStylesheet("themes");

    if (settings.global && urls.includes(window.location.origin)) {
      // inject themes
      if (settings.themes) {
        injectThemes();

        // inject CSS variables
        injectCatppuccin(settings.themeFlavour, settings.themeAccent);
      }

      // inject logo
      injectLogo(LOGO_INFO[settings.themeLogo as LogoId], settings.themeLogoAsFavicon);

      // inject user snippets
      if (settings.snippets) {
        const userSnippets = globalSettings.get().userSnippets;
        for (const id of Object.keys(userSnippets)) {
          injectUserSnippet(id);
        }
      }

      // update icon
      browser.runtime.sendMessage({ updateIcon: true });

      // storage listeners for hot reload
      // if global is toggled, inject or uninject theme and snippets
      globalSettings.storage.watch((newValue, oldValue) => {
        updateThemes(newValue, oldValue);
        updateUserSnippets(newValue, oldValue);
      });
    }
  },
});
