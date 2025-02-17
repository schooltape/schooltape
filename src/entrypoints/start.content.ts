import cssUrl from "./catppuccin.css?url";
import "./catppuccin.css";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "manual",
  runAt: "document_start",
  excludeMatches: ["*://*/learning/quiz/*"],
  async main() {
    let settings = await globalSettings.getValue();

    if (settings.global && settings.urls.includes(window.location.origin)) {
      // inject themes
      if (settings.themes) {
        injectStylesheet(cssUrl);
        injectCatppuccin(settings.themeFlavour, settings.themeAccent);
      }

      // inject logo
      injectLogo(LOGO_INFO[settings.themeLogo as LogoId]);

      // inject snippets
      if (settings.snippets) {
        injectSnippets(settings.userSnippets);
      }
    }
  },
});
