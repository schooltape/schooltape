import { browser } from "#imports";
import type { Browser } from "#imports";
import { logger } from "@/utils/logger";

export function initContextMenus() {
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
}
