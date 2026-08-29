import { defineBackground } from "#imports";
import { global } from "@/utils/storage";
import { updateIcon } from "./icon";
import { initInstalledListener } from "./listeners/installed";
import { initMessaging } from "./listeners/messaging";
import { initContextMenus } from "./listeners/contextMenus";

export default defineBackground(() => {
  initInstalledListener();
  initMessaging();
  initContextMenus();

  // update icon when toggle or update is changed
  global.watch(updateIcon);
});
