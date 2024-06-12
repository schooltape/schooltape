export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_start",
  async main() {
    let settings = await globalSettings.getValue();
    let themes = await themeSettings.getValue();
    let plugins = await pluginSettings.getValue();
    let snippets = await snippetSettings.getValue();

    if (settings.global && settings.urls.includes(window.location.origin)) {
      // inject themes
      if (themes.toggle) {
        logger.info(themes);
        injectCSS("/assets/catppuccin.css");
        injectCatppuccin(themes.flavour, themes.accent);
      }
      // inject plugins
      if (plugins.toggle) {
        for (let i = 0; i < plugins.enabled.length; i++) {
          injectPlugin(plugins.enabled[i], "doc-start");
        }
      }
      // inject snippets
      if (snippets.toggle) {
        injectSnippets();
      }
    }
  },
});
