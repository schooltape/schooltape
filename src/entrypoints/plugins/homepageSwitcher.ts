import { browser } from "#imports";
import { Plugin } from "@/utils/plugin";
import type { Toggle } from "@/utils/storage";
import type { StorageState } from "@/utils/storage/state.svelte";

let logos: HTMLAnchorElement[] | null = null;
let controller: AbortController | null = null;

type Settings = {
  closeCurrentTab: StorageState<Toggle>;
};

export default new Plugin<Settings>(
  {
    id: "homepageSwitcher",
    name: "Homepage Switcher",
    description: "The logo will switch to existing Schoolbox homepage when available.",
  },
  {
    toggle: true,
    settings: {
      closeCurrentTab: {
        toggle: false,
      },
    },
  },
  async (settings) => {
    if (logos !== null) return;

    logos = Array.from(document.getElementsByClassName("logo")) as HTMLAnchorElement[];

    // add event listeners
    const closeCurrentTab = await settings.closeCurrentTab.get();
    controller = new AbortController();

    for (const logo of logos) {
      logo.addEventListener(
        "click",
        (e) => {
          if (window.location.pathname === "/") return;

          e.preventDefault();

          if (logos) {
            const tab = logos[0].href;
            if (closeCurrentTab.toggle) window.close(); // TODO:  Scripts may only close windows that were opened by a script.
            browser.runtime.sendMessage({ toTab: tab });
          }
        },
        {
          signal: controller.signal,
        },
      );
    }
  },
  () => {
    // remove event listeners
    if (controller) {
      controller.abort();
      controller = null;
    }

    logos = null;
  },
  [".logo"],
);
