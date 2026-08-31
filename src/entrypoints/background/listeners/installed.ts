import { browser } from "#imports";
import { logger } from "@/utils/logger";
import { updated } from "@/utils/storage";
import { updateIcon } from "../icon";
import { runSemverMigrations } from "../migrations";

export function initInstalledListener() {
  browser.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
    if (reason === "install") {
      logger.info("[background] Opening wiki page after install");
      browser.tabs.create({ url: "https://schooltape.github.io/installed" });

      if (import.meta.env.DEV) {
        logger.info("[background] Opening development URLs");
        browser.tabs.create({ url: "https://help.schoolbox.com.au/account/anonymous.php?" });
        browser.tabs.create({ url: browser.runtime.getURL("/popup.html") });
        const schoolbox = {
          url: import.meta.env.WXT_SCHOOLBOX_URL,
          jwt: import.meta.env.WXT_SCHOOLBOX_JWT,
        };
        if (schoolbox.url && schoolbox.jwt) {
          browser.tabs.create({ url: `${schoolbox.url}/api/session?jwt=${schoolbox.jwt}` });
        }
      }
    } else if (reason === "update") {
      logger.info("[background] Showing update badge");

      await updated.set({ icon: true, changelog: true });
      updateIcon();

      const manifest = browser.runtime.getManifest();
      const newVersion = manifest.version_name || manifest.version;

      if (previousVersion) runSemverMigrations(previousVersion, newVersion);

      if (import.meta.env.DEV) {
        logger.info("[background] Opening development URLs");
        browser.tabs.create({ url: browser.runtime.getURL("/popup.html"), active: false });
      }
    }
  });
}
