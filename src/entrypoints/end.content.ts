export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_end",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    const settings = await globalSettings.storage.getValue();
    const urls = (await schoolboxUrls.storage.getValue()).urls;

    if (import.meta.env.DEV) {
      console.log((await schoolboxUrls.storage.getValue()).urls);
    }

    if (!settings.global) return;
    const footer = document.querySelector("#footer > ul");
    if (footer && footer.innerHTML.includes("Schoolbox")) {
      const footerListItem = document.createElement("li");
      const footerLink = document.createElement("a");
      footerLink.href = "https://github.com/schooltape/schooltape";
      footerLink.textContent = `Schooltape v${browser.runtime.getManifest().version}`;
      footerListItem.appendChild(footerLink);
      footer.appendChild(footerListItem);

      if (!urls.includes(window.location.origin)) {
        logger.info("[end.content.ts] URL not in settings, adding...");
        if (!urls.includes(window.location.origin)) {
          urls.push(window.location.origin);
          await schoolboxUrls.storage.setValue({ urls });
          // TODO: hot reload
          window.location.reload();
        }
      }
    }
  },
});
