import { Menus } from "wxt/browser";

export default defineBackground(() => {
  checkForUpdates();

  browser.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason === "install") {
      logger.info("[background] Opening wiki page after install");
      browser.tabs.create({ url: "https://schooltape.github.io/installed" });
      if (import.meta.env.DEV) {
        logger.info("[background] Opening development URLs");
        browser.tabs.create({ url: "https://help.schoolbox.com.au/account/anonymous.php?" });
        browser.tabs.create({ url: browser.runtime.getURL("/popup.html") });
      }
      if (import.meta.env.VITE_OSS_BUILD == true) {
        logger.info("[background] This is an OSS build, adding to settings");
        await globalSettings.setValue({
          ...(await globalSettings.getValue()),
          updates: {
            ...(await globalSettings.getValue()).updates,
            available: true,
          },
        });
      }
    } else if (reason === "update") {
      logger.info("[background] Notifying user about the update");
      browser.notifications.create("updated", {
        title: "Schooltape updated",
        type: "basic",
        iconUrl: browser.runtime.getURL("/icon/128.png"),
        message: "Click here to look at the release notes.",
      });
      if (import.meta.env.DEV) {
        logger.info("[background] Opening development URLs");
        browser.tabs.create({ url: browser.runtime.getURL("/popup.html"), active: false });
      }
    }
  });

  browser.notifications.onClicked.addListener(function (notifID) {
    if (notifID === "update") {
      browser.tabs.create({
        url: "https://github.com/schooltape/schooltape/releases/latest",
      });
    }
    if (notifID === "updated") {
      browser.tabs.create({
        url: `https://github.com/schooltape/schooltape/releases/tag/v${browser.runtime.getManifest().version}`,
      });
    }
  });

  // watch for global toggle
  globalSettings.watch(async (newSettings, oldSettings) => {
    // update icon and check for updates
    if (newSettings.global !== oldSettings.global) {
      logger.info(`[background] Global toggle changed to ${newSettings.global}`);
      // update icon
      updateIcon();
      // if global is enabled, check for updates
      if (newSettings.global) {
        checkForUpdates();
      }
    }
  });

  // listen for messages
  browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    logger.child({ message, sender }).info("[background] Received message");
    if (message.resetSettings) {
      resetSettings();
    }
    if (message.inject && sender.tab?.id) {
      logger.info(`[background] Injecting ${message.inject}`);
      // https://wxt.dev/guide/extension-apis/scripting.html
      const res = await browser.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: [message.inject],
      });
    }
    if (message.toTab) {
      const tabs = await browser.tabs.query({ url: message.toTab });
      if (tabs.length > 0) {
        browser.tabs.update(tabs[0].id, { active: true });
      } else if (sender.tab?.id) {
        browser.tabs.update(sender.tab.id, { url: message.toTab });
      }
    }
    if (message.checkForUpdates) {
      return checkForUpdates();
    }
    return true;
  });

  // context menus
  let contexts: Menus.ContextType[];
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
  browser.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
      case "report-bug":
        browser.tabs.create({
          url: "https://github.com/schooltape/schooltape/issues/new?assignees=42willow&labels=bug&projects=&template=bug-report.yml",
        });
        break;
      case "feature-request":
        browser.tabs.create({
          url: "https://github.com/schooltape/schooltape/issues/new?assignees=42willow&labels=enhancement&projects=&template=feature_request.yml",
        });
        break;
      case "github":
        browser.tabs.create({ url: "https://github.com/schooltape/schooltape" });
        break;
    }
  });
});

async function resetSettings(): Promise<void> {
  logger.info("[background] Resetting settings");
  await storage.removeItems([
    "local:globalSettings",
    "local:snippetSettings",
    "local:pluginSettings",
    "local:themeSettings",
  ]);
}

async function checkForUpdates(): Promise<boolean> {
  if (!navigator.onLine) {
    logger.error("[background] Failed to check for updates: offline");
    return false;
  }
  if (import.meta.env.DEV) {
    logger.warn("[background] Skipping update check in dev mode");
    return false;
  }
  try {
    const response = await fetch("https://api.github.com/repos/schooltape/schooltape/releases/latest");
    if (!response.ok) {
      throw new Error(`Failed to fetch latest release: ${response.statusText}`);
    }
    const data = await response.json();
    const latestVersion = data.tag_name.replace("v", "");
    const currentVersion = browser.runtime.getManifest().version_name;
    // if there is an update available
    if (latestVersion !== currentVersion) {
      logger.info(`[background] Found new version: ${latestVersion}`);
      // set update available
      await globalSettings.setValue({
        ...(await globalSettings.getValue()),
        updates: {
          ...(await globalSettings.getValue()).updates,
          available: true,
        },
      });
      // notify
      if ((await globalSettings.getValue()).updates.desktop) {
        browser.notifications.create("update", {
          title: "Available update",
          type: "basic",
          iconUrl: browser.runtime.getURL("/icon/128.png"),
          message: `Click here to update to v${latestVersion}`,
        });
      }
      // update icon accordingly
      updateIcon();
      return true;
    }
  } catch (error) {
    logger.error(`[background] Failed to check for updates: ${error}`);
    return false;
  }
  return false;
}

async function updateIcon() {
  const global = (await globalSettings.getValue()).global;
  const updateAvailable = (await globalSettings.getValue()).updates.available;
  let iconSuffix = "-disabled";
  if (global) {
    if (updateAvailable) {
      iconSuffix = "-green";
    } else {
      iconSuffix = "";
    }
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
