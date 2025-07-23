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
      logger.info("[background] Showing update badge");

      await globalSettings.set({ updated: true });
      updateIcon();

      if (import.meta.env.DEV) {
        logger.info("[background] Opening development URLs");
        browser.tabs.create({ url: browser.runtime.getURL("/popup.html"), active: false });
      }
    }
  });

  // update icon when toggle or update is changed
  globalSettings.storage.watch(() => {
    updateIcon();
  });

  // listen for messages
  interface Message {
    resetSettings?: boolean;
    inject?: string;
    toTab?: string;
    updateIcon?: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  browser.runtime.onMessage.addListener(async (msg: any, sender: any) => {
    const message = msg as Message;
    logger.child({ message, sender }).info("[background] Received message");

    if (message.resetSettings) {
      resetSettings();
    } else if (message.toTab) {
      const tabs = await browser.tabs.query({ url: message.toTab });
      if (tabs.length > 0) {
        // @ts-expect-error - tab will exist
        browser.tabs.update(tabs[0].id, { active: true });
      } else if (sender.tab?.id) {
        browser.tabs.update(sender.tab.id, { url: message.toTab });
      }
    } else if (message.updateIcon) {
      updateIcon();
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
  const settingsValue = await globalSettings.storage.getValue();

  let iconSuffix = "";

  // if it's june
  if (new Date().getMonth() === 5) {
    iconSuffix += "-ctp";
  }
  if (settingsValue.global === false) {
    iconSuffix += "-disabled";
  }
  if (settingsValue.updated === true) {
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
