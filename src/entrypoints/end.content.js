export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_end",
  excludeMatches: ["*://*/learning/quiz/*"],
  async main() {
    let settings = await globalSettings.getValue();
    let plugins = await pluginSettings.getValue();

    if (settings.global) {
      if (settings.urls.includes(window.location.origin)) {
        // inject plugins
        // if (plugins.toggle) {
        //   for (let i = 0; i < plugins.enabled.length; i++) {
        //     injectPlugin(plugins.enabled[i], "doc-end");
        //   }
        // }
      } else {
        // detect Schoolbox
        let footer = document.querySelector("#footer > ul");
        if (footer.innerHTML.includes("Schoolbox")) {
          let footerListItem = document.createElement("li");
          footerListItem.appendChild(document.createElement("a")).href = "https://github.com/schooltape/schooltape";
          footerListItem.firstChild.textContent = `Schooltape v${browser.runtime.getManifest().version}`;
          footer.appendChild(footerListItem);
          if (!settings.urls.includes(window.location.origin)) {
            settings.urls.push(window.location.origin);
            await globalSettings.setValue(settings);
            // TODO: hot reload
            window.location.reload();
          }
        }
      }
    }
  },
});
