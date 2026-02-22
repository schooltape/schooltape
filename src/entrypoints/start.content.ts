import { browser, defineContentScript } from "#imports";
import {
  hasChanged,
  injectCatppuccin,
  injectStylesheet,
  onSchoolboxPage,
  sendMessage,
  uninjectCatppuccin,
  uninjectStylesheet,
} from "@/utils";
import { EXCLUDE_MATCHES } from "@/utils/constants";
import type { SettingsV3 } from "@/utils/storage";
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

    const updateThemes: WatchCallback<SettingsV3> = async (newValue, oldValue) => {
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

    // @ts-expect-error unlisted CSS not a PublicPath
    const injectThemes = () => injectStylesheet(browser.runtime.getURL(cssUrl), "themes");
    const uninjectThemes = () => uninjectStylesheet("themes");

    // storage listeners for hot reload
    globalSettings.watch((newValue, oldValue) => {
      updateThemes(newValue, oldValue);
    });

    const settings = await globalSettings.get();
    if (settings.global && (await onSchoolboxPage())) {
      // inject themes
      if (settings.themes) {
        injectThemes();
        injectCatppuccin();
      }

      // update icon
      sendMessage({ type: "updateIcon" });
    }
  },
});
