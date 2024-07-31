export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_end",
  excludeMatches: ["*://*/learning/quiz/*"],
  async main() {
    let settings = await globalSettings.getValue();
    // let plugins = await pluginSettings.getValue();

    if (!settings.global) return;
    let footer = document.querySelector("#footer > ul");
    if (footer && footer.innerHTML.includes("Schoolbox")) {
      let footerListItem = document.createElement("li");
      let footerLink = document.createElement("a");
      footerLink.href = "https://github.com/schooltape/schooltape";
      footerLink.textContent = `Schooltape v${browser.runtime.getManifest().version}`;
      footerListItem.appendChild(footerLink);
      footer.appendChild(footerListItem);

      if (!settings.urls.includes(window.location.origin)) {
        logger.info("[end.content.ts] URL not in settings, adding...");
        if (!settings.urls.includes(window.location.origin)) {
          settings.urls.push(window.location.origin);
          await globalSettings.setValue(settings);
          // TODO: hot reload
          window.location.reload();
        }
      }
    }
  },
});
