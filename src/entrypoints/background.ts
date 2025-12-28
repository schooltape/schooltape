import type { Browser } from "#imports";
import { browser, defineBackground, storage } from "#imports";
import { logger } from "@/utils/logger";
import type { BackgroundMessage } from "@/utils/storage";
import { globalSettings, updated } from "@/utils/storage";
import semver from "semver";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
    if (reason === "install") {
      logger.info("[background] Opening wiki page after install");
      browser.tabs.create({ url: "https://schooltape.github.io/installed" });

      if (import.meta.env.DEV) {
        logger.info("[background] Opening development URLs");
        browser.tabs.create({ url: "https://help.schoolbox.com.au/account/anonymous.php?" });
        browser.tabs.create({ url: browser.runtime.getURL("/popup.html") });
        const env = {
          domain: import.meta.env.WXT_SCHOOLBOX_DOMAIN,
          jwt: import.meta.env.WXT_SCHOOLBOX_JWT,
        };
        if (env.domain && env.jwt) {
          browser.tabs.create({ url: `${env.domain}/api/session?jwt=${env.jwt}` });
        }
      }
    } else if (reason === "update") {
      logger.info("[background] Showing update badge");

      await updated.set({ icon: true, changelog: true });
      updateIcon();

      const manifest = browser.runtime.getManifest();
      const newVersion = manifest.version_name || manifest.version;

      // hacky way of resetting the extension to fix migration issues
      // new version is greater than or equal to v4.0.5 AND previous version was less than v4.0.5
      if (previousVersion && semver.gte(newVersion, "4.0.5") && semver.lt(previousVersion, "4.0.5")) {
        logger.info("[background] Clearing storage (v4.0.5 migration)");
        await storage.clear("local");
      }

      if (import.meta.env.DEV) {
        logger.info("[background] Opening development URLs");
        browser.tabs.create({ url: browser.runtime.getURL("/popup.html"), active: false });
      }
    }
  });

  // update icon when toggle or update is changed
  globalSettings.watch(updateIcon);

  browser.runtime.onMessage.addListener(async (msg: BackgroundMessage, sender: Browser.runtime.MessageSender) => {
    logger.info("[background] received message", { message: msg, sender });

    switch (msg.type) {
      case "resetSettings":
        resetSettings();
        break;
      case "updateIcon":
        updateIcon();
        break;
      case "closeTab":
        if (!sender.tab?.id) break;
        browser.tabs.remove(sender.tab.id);
        break;
      case "updateTabUrl":
        if (!sender.tab?.id) break;
        browser.tabs.update(sender.tab.id, { url: msg.url });
        break;
      default:
        logger.error(`[background] unknown message received: ${msg}`);
    }

    return true; // return success
  });

  // context menus
  let contexts: Browser.contextMenus.CreateProperties["contexts"];
  logger.info(`[background] Manifest version: ${import.meta.env.MANIFEST_VERSION}`);
  if (import.meta.env.MANIFEST_VERSION === 2) {
    contexts = ["browser_action"];
  } else {
    contexts = ["action"];
  }
  browser.contextMenus.create({
    id: "report-bug",
    title: "Report a bug...",
    contexts: contexts,
  });
  browser.contextMenus.create({
    id: "feature-request",
    title: "Request a feature...",
    contexts: contexts,
  });
  browser.contextMenus.create({
    id: "github",
    title: "GitHub",
    contexts: contexts,
  });
  browser.contextMenus.onClicked.addListener((info) => {
    const manifest = browser.runtime.getManifest();
    const version = manifest.version_name || manifest.version;

    switch (info.menuItemId) {
      case "report-bug":
        browser.tabs.create({
          url: `https://github.com/schooltape/schooltape/issues/new?template=bug.yml&version=v${version}`,
        });
        break;
      case "feature-request":
        browser.tabs.create({
          url: "https://github.com/schooltape/schooltape/issues/new?template=feature.yml",
        });
        break;
      case "github":
        browser.tabs.create({ url: "https://github.com/schooltape/schooltape" });
        break;
    }
  });
});

async function resetSettings(): Promise<void> {
  logger.info("[background] Clearing local storage");
  await storage.clear("local");
}

async function updateIcon() {
  logger.info("[background] Updating icon...");

  let iconSuffix = "";

  // if it's june
  if (new Date().getMonth() === 5) {
    iconSuffix += "-ctp";
  }
  if ((await globalSettings.get()).global === false) {
    iconSuffix += "-disabled";
  }
  if ((await updated.get()).icon === true) {
    iconSuffix += "-badge";
  }

  if (import.meta.env.MANIFEST_VERSION === 2) {
    browser.browserAction.setIcon({
      path: {
        16: `/icon/16${iconSuffix}.png`,
        32: `/icon/32${iconSuffix}.png`,
        48: `/icon/48${iconSuffix}.png`,
        128: `/icon/128${iconSuffix}.png`,
      },
    });
  } else {
    browser.action.setIcon({
      path: {
        16: `/icon/16${iconSuffix}.png`,
        32: `/icon/32${iconSuffix}.png`,
        48: `/icon/48${iconSuffix}.png`,
        128: `/icon/128${iconSuffix}.png`,
      },
    });
  }
}
