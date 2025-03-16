import cssUrl from "./catppuccin.css?url";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "manual",
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    const settings = await globalSettings.getValue();
    const urls = await schoolboxUrls.getValue();

    if (settings.global && urls.includes(window.location.origin)) {
      // inject themes
      if (settings.themes) {
        injectStylesheet(cssUrl);
        injectCatppuccin(settings.themeFlavour, settings.themeAccent);
      }

      // inject logo
      injectLogo(LOGO_INFO[settings.themeLogo as LogoId]);

      // inject snippets
      if (settings.snippets) {
        injectUserSnippets(settings.userSnippets);
      }
    }
  },
});
