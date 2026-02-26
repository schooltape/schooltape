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
import { global, quickCSS, snippets, themes } from "@/utils/storage";
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

      uninjectCatppuccin();

      if ((await global.get()) && (await themes.get()).toggle) {
        injectCatppuccin();
        injectThemes();
      } else {
        uninjectThemes();
      }
    };

    const updateQuickCSS = async () => {
      const injectQuickCSS = async () => injectInlineStyles((await quickCSS.get()).value, "quick-css");
      const uninjectQuickCSS = () => uninjectInlineStyles("quick-css");

      uninjectQuickCSS();

      if ((await global.get()) && (await snippets.get()).toggle && (await quickCSS.get()).toggle) {
        injectQuickCSS();
      }
    };

    onSchoolboxPage().then((onSchoolboxPage) => {
      if (!onSchoolboxPage) return;

      updateThemes();
      updateQuickCSS();

      global.watch(() => {
        updateThemes();
        updateQuickCSS();
      });
      themes.watch(updateThemes);
      quickCSS.watch(updateQuickCSS);
      snippets.watch(updateQuickCSS);

      // update icon
      sendMessage({ type: "updateIcon" });
    });
  },
});
