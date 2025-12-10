import { browser } from "#imports";
import { definePlugin } from "@/utils/plugin";

let logos: HTMLAnchorElement[] | null = null;
let controller: AbortController | null = null;

export default function init() {
  definePlugin(
    "homepageSwitcher",
    (settings) => {
      if (logos !== null) return;

      logos = Array.from(document.getElementsByClassName("logo")) as HTMLAnchorElement[];

      // add event listeners
      const closeCurrentTab = settings?.toggle.closeCurrentTab === true;
      controller = new AbortController();

      for (const logo of logos) {
        logo.addEventListener(
          "click",
          (e) => {
            if (window.location.pathname === "/") return;

            e.preventDefault();

            if (logos) {
              const tab = logos[0].href;
              if (closeCurrentTab) window.close(); // TODO:  Scripts may only close windows that were opened by a script.
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
}
