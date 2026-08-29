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

    const sbxStylesheets: HTMLLinkElement[] = [];
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
    const updateQuickCSS = async () => {
      const injectQuickCSS = async () => injectInlineStyles((await quickCSS.get()).value, "quick-css");
      const uninjectQuickCSS = () => uninjectInlineStyles("quick-css");

      uninjectQuickCSS();

      if ((await global.get()) && (await snippets.get()).toggle && (await quickCSS.get()).toggle) {
        injectQuickCSS();
      }
    };

      updateQuickCSS();
        updateQuickCSS();
      quickCSS.watch(updateQuickCSS);
      snippets.watch(updateQuickCSS);

      // update icon
      sendMessage({ type: "updateIcon" });
    }
  },
});
