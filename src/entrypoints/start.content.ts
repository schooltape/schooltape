import cssUrl from "./catppuccin.css?url";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "manual",
  runAt: "document_start",
  excludeMatches: ["*://*/learning/quiz/*"],
  async main() {
    let settings = await globalSettings.getValue();
    let themes = await themeSettings.getValue();
    let snippets = await snippetSettings.getValue();

    globalSettings.setValue(settings);

    if (settings.global && settings.urls.includes(window.location.origin)) {
      // inject themes
      if (themes.toggle) {
        logger.info(themes);
        injectStylesheet(cssUrl);
        injectCatppuccin(themes.flavour, themes.accent);
      }
      // inject logo
      // a.logo > img {
      //   content: url("https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png");
      //   max-width: 30%;
      // }
      injectLogo(themes.logo);

      // inject snippets
      if (snippets.toggle) {
        injectSnippets();
      }
    }
  },
});
