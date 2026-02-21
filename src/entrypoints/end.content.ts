import { defineContentScript } from "#imports";
import { EXCLUDE_MATCHES } from "@/utils/constants";
import { logger } from "@/utils/logger";
import { globalSettings, schoolboxUrls } from "@/utils/storage";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_end",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    await globalSettings.ready;
    await schoolboxUrls.ready;

    if (!globalSettings.state.global) return;

    const footer = document.querySelector("#footer > ul");

    if (footer && footer.innerHTML.includes("Schoolbox")) {
      const urls = schoolboxUrls.state.urls;

      if (!urls.includes(window.location.origin)) {
        logger.info(`URL ${window.location.origin} not in storage, adding...`);
        urls.push(window.location.origin);
        // TODO: hot reload
        await schoolboxUrls.save();
        window.location.reload();
      }
    }
  },
});
