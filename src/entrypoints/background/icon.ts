import { browser } from "#imports";
import { logger } from "@/utils/logger";
import { global, updated } from "@/utils/storage";

export async function updateIcon() {
  logger.info("[background] Updating icon...");

  let iconSuffix = "";

  // if it's june
  if (new Date().getMonth() === 5) {
    iconSuffix += "-ctp";
  }
  if ((await global.get()) === false) {
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
