import { browser, storage } from "#imports";
import type { Browser } from "#imports";
import { logger } from "@/utils/logger";
import type { BackgroundMessage } from "@/utils/storage";
import { updateIcon } from "../icon";

export function initMessaging() {
  browser.runtime.onMessage.addListener(async (msg: BackgroundMessage, sender: Browser.runtime.MessageSender) => {
    logger.info("[background] received message", { message: msg, sender });

    if (msg.type === "resetSettings") {
      logger.info("[background] Clearing local storage");
      await storage.clear("local");
    } else if (msg.type === "updateIcon") {
      updateIcon();
    } else if (msg.type === "toTab") {
      const toTab = await browser.tabs.query({ url: msg.url });
      if (toTab.length > 0) {
        browser.tabs.update(toTab[0]!.id, { active: true });
        if (msg.closeIfFound && sender.tab?.id && sender.tab.id !== toTab[0]!.id) {
          browser.tabs.remove(sender.tab.id);
        }
      } else if (sender.tab?.id) {
        browser.tabs.update(sender.tab.id, { url: msg.url });
      }
    } else {
      logger.error(`[background] unknown message received: ${msg}`);
    }

    return true; // return success
  });
}
