import { defineContentScript } from "#imports";
import { EXCLUDE_MATCHES } from "@/utils/constants";
import { logger } from "@/utils/logger";
import { globalSettings, schoolboxUrls } from "@/utils/storage";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_end",
  excludeMatches: EXCLUDE_MATCHES,
  async main() {
    const settings = await globalSettings.get();
    const urls = (await schoolboxUrls.get()).urls;

    logger.info(urls);

    if (!settings.global) return;

    const footer = document.querySelector("#footer > ul");

    if (footer && footer.innerHTML.includes("Schoolbox")) {
      if (!urls.includes(window.location.origin)) {
        logger.info(`URL ${window.location.origin} not in storage, adding...`);
        urls.push(window.location.origin);
        await schoolboxUrls.set({ urls });
        // TODO: hot reload
        window.location.reload();
      }
    }
  },
});
