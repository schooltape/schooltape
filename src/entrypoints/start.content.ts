import { browser, defineContentScript } from "#imports";
import {
  injectCatppuccin,
  injectInlineStyles,
  injectStylesheet,
  onSchoolboxPage,
  sendMessage,
  uninjectCatppuccin,
  uninjectInlineStyles,
  uninjectStylesheet,
} from "@/utils";
import { EXCLUDE_MATCHES } from "@/utils/constants";
import { globalSettings, quickCSS } from "@/utils/storage";
import cssUrl from "./catppuccin.css?url";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "manual",
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    // if not on Schoolbox page
    if (!(await onSchoolboxPage())) return;

    const updateThemes = async () => {
      // @ts-expect-error unlisted CSS not a PublicPath
      const injectThemes = () => injectStylesheet(browser.runtime.getURL(cssUrl), "themes");
      const uninjectThemes = () => uninjectStylesheet("themes");

      const settings = await globalSettings.get();

      uninjectCatppuccin();

      if (settings.global && settings.themes) {
        injectCatppuccin();
        injectThemes();
      } else {
        uninjectThemes();
      }
    };

    const updateQuickCSS = async () => {
      const injectQuickCSS = async () => injectInlineStyles((await quickCSS.get()).value, "quick-css");
      const uninjectQuickCSS = () => uninjectInlineStyles("quick-css");

      const settings = await globalSettings.get();
      const toggle = (await quickCSS.get()).toggle;

      uninjectQuickCSS();

      if (settings.global && settings.snippets && toggle) {
        injectQuickCSS();
      }
    };

    onSchoolboxPage().then((onSchoolboxPage) => {
      if (!onSchoolboxPage) return;

      updateThemes();
      updateQuickCSS();

      globalSettings.watch(() => {
        updateThemes();
        updateQuickCSS();
      });
      quickCSS.watch(updateQuickCSS);

      // update icon
      sendMessage({ type: "updateIcon" });
    });
  },
});
