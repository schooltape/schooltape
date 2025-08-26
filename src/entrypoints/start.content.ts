import cssUrl from "./catppuccin.css?url";

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "manual",
  runAt: "document_start",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    const settings = await globalSettings.storage.getValue();
    const urls = (await schoolboxUrls.storage.getValue()).urls;
    if (settings.global && urls.includes(window.location.origin)) {
      // inject themes
      if (settings.themes) {
        injectStylesheet(cssUrl);
        injectCatppuccin(settings.themeFlavour, settings.themeAccent);
      }

      // inject logo
      injectLogo(LOGO_INFO[settings.themeLogo as LogoId], settings.themeLogoAsFavicon);

      // inject snippets
      if (settings.snippets) {
        injectUserSnippets(settings.userSnippets);
      }

      // update icon
      browser.runtime.sendMessage({ updateIcon: true });
    }

    // washi auth
    if (window.location.href === "https://schooltape.github.io/washi-auth") {
      // close current tab
      browser.runtime.sendMessage({ closeTab: true });

      // open washi auth page
      browser.runtime.sendMessage({ washiAuth: true });
    }
  },
});
