import { browser, storage } from "#imports";
import { logger } from "@/utils/logger";
import semver from "semver";
import type { Settings as LogoSettings } from "@/entrypoints/plugins/changeLogo";

export async function runSemverMigrations(previousVersion: string, newVersion: string) {
  // hacky way of resetting the extension to fix migration issues
  // new version is greater than or equal to v4.0.5 AND previous version was less than v4.0.5
  if (previousVersion && semver.gte(newVersion, "4.0.5") && semver.lt(previousVersion, "4.0.5")) {
    logger.info("[background] Clearing storage (v4.0.5 migration)");
    await storage.clear("local");
  }

  // https://github.com/wxt-dev/wxt/pull/2130
  if (previousVersion && semver.gte(newVersion, "4.4.1") && semver.lt(previousVersion, "4.4.1")) {
    logger.info("[background] Patching change logo storage (v4.4.1 migration)");

    const { plugins } = await import("@/entrypoints/plugins.content");
    const changeLogo = plugins.find((plugin) => plugin.meta.id === "changeLogo");

    if (changeLogo) {
      const settings = changeLogo.settings as LogoSettings | undefined;

      if ((await settings?.logo.get())?.id == null) {
        await storage.removeItem("local:plugin-changeLogo-logo");
      }
      if ((await settings?.setAsFavicon.get())?.toggle == null) {
        await storage.removeItem("local:plugin-changeLogo-setAsFavicon");
      }
      if ((await changeLogo.toggle.get()).toggle == null) {
        await storage.removeItem("local:plugin-changeLogo");
      }
    }
  }

  // open sonar UI blogpost
  if (previousVersion && semver.gte(newVersion, "4.5.4") && semver.lt(previousVersion, "4.5.4")) {
    browser.tabs.create({ url: "https://schooltape.github.io/blog/sonar-ui" });
  }
}
