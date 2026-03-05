import { Plugin } from "@/utils/plugin";
import type { Toggle } from "@/utils/storage";
import type { StorageState } from "@/utils/storage/state.svelte";

const ID = "betterNotifications";

export type Settings = {
  scrapeNotifications: StorageState<Toggle>;
};

export default new Plugin<Settings>(
  {
    id: ID,
    name: "Better Notifications",
    description: "TODO: description",
  },
  true,
  {
    scrapeNotifications: { toggle: true },
  },
  async (_settings) => {
    console.log("Better Notifications plugin initialized", _settings);

    const messageList = document.getElementById("msg-content");

    if (messageList) {
      console.log("Found message list element:", messageList);

      messageList.parentElement!.innerHTML = "<p>it works!!!</p>";
    }
  },
  (_settings) => {
    console.log("Better Notifications plugin stopped", _settings);
  },
);
