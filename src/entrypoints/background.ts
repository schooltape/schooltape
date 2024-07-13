import { Menus } from "wxt/browser";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason === "install") {
      logger.info("[background] Opening wiki page after install");
      browser.tabs.create({ url: "https://schooltape.github.io/installed" });
      if (import.meta.env.DEV) {
        logger.info("[background] Opening development URLs");
        browser.tabs.create({ url: "https://help.schoolbox.com.au/account/anonymous.php?" });
        browser.tabs.create({ url: browser.runtime.getURL("/popup.html") });
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
    if (newSettings.global !== oldSettings.global) {
      logger.info(`[background] Global toggle changed to ${newSettings.global}`);
      // update icon
      updateIcon();
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

async function updateIcon() {
  const global = (await globalSettings.getValue()).global;
  let iconSuffix = "-disabled";
  if (global) {
    iconSuffix = "";
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
