export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_end",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    let settings = await globalSettings.getValue();
    let urls = await schoolboxUrls.getValue();

    if (!settings.global) return;
    let footer = document.querySelector("#footer > ul");
    if (footer && footer.innerHTML.includes("Schoolbox")) {
      let footerListItem = document.createElement("li");
      let footerLink = document.createElement("a");
      footerLink.href = "https://github.com/schooltape/schooltape";
      footerLink.textContent = `Schooltape v${browser.runtime.getManifest().version}`;
      footerListItem.appendChild(footerLink);
      footer.appendChild(footerListItem);

      if (!urls.includes(window.location.origin)) {
        logger.info("[end.content.ts] URL not in settings, adding...");
        if (!urls.includes(window.location.origin)) {
          urls.push(window.location.origin);
          await schoolboxUrls.setValue(urls);
          // TODO: hot reload
          window.location.reload();
        }
      }
    }
  },
});
