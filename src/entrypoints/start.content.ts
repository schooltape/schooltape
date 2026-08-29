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
import { global, quickCSS, themes } from "@/utils/storage";
import cssUrl from "./catppuccin.css?url";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "manual",
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    // if not on Schoolbox page
    if (!(await onSchoolboxPage())) return;

    const sbxStylesheets: HTMLLinkElement[] = [];

    const updateThemes = async () => {
      const injectThemes = () => {
        // @ts-expect-error unlisted CSS not a PublicPath
        injectStylesheet(browser.runtime.getURL(cssUrl), "themes");

        // disable Sonar UI
        let sbxCore = document.querySelector<HTMLLinkElement>('head > link[href*="sbx-core.css"]');
        let sbxSkin = document.querySelector<HTMLLinkElement>('head > link[href*="skin.css.php"]');
        if (sbxCore && sbxSkin) {
          // it is important these are in this order
          sbxStylesheets.push(sbxSkin, sbxCore);
          sbxSkin.remove();
          sbxCore.remove();
        }
      };
      const uninjectThemes = () => {
        uninjectStylesheet("themes");
        // enable Sonar UI
        while (sbxStylesheets.length > 0) {
          let link = sbxStylesheets.pop();
          if (link) document.head.appendChild(link);
        }
      };

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

      if ((await global.get()) && (await quickCSS.get()).toggle) {
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

      // update icon
      sendMessage({ type: "updateIcon" });
    });
  },
});
