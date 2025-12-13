import { browser, defineContentScript } from "#imports";
import {
  hasChanged,
  injectCatppuccin,
  injectStylesheet,
  injectUserSnippet,
  onSchoolboxPage,
  uninjectCatppuccin,
  uninjectStylesheet,
  uninjectUserSnippet,
} from "@/utils";
import { EXCLUDE_MATCHES } from "@/utils/constants";
import type { SettingsV2 } from "@/utils/storage";
import { globalSettings } from "@/utils/storage";
import type { WatchCallback } from "wxt/utils/storage";
import cssUrl from "./catppuccin.css?url";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "manual",
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    // if not on Schoolbox page
    if (!(await onSchoolboxPage())) return;

    const updateThemes: WatchCallback<SettingsV2> = async (newValue, oldValue) => {
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

    const updateUserSnippets: WatchCallback<SettingsV2> = async (newValue, oldValue) => {
      // if global or userSnippets were changed
      if (hasChanged(newValue, oldValue, ["global", "userSnippets"])) {
        // uninject removed snippets
        if (oldValue) {
          for (const id of Object.keys(oldValue.userSnippets)) {
            if (!newValue.userSnippets[id]) {
              uninjectUserSnippet(id);
            }
          }
        }

        // inject/uninject current snippets
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
    globalSettings.watch((newValue, oldValue) => {
      updateThemes(newValue, oldValue);
      updateUserSnippets(newValue, oldValue);
    });

    const settings = await globalSettings.get();
    if (settings.global && (await onSchoolboxPage())) {
      // inject themes
      if (settings.themes) {
        injectThemes();
        injectCatppuccin();
      }

      // inject user snippets
      if (settings.snippets) {
        const userSnippets = (await globalSettings.get()).userSnippets;
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
