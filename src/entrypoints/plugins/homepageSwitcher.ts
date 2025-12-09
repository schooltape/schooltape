import { browser } from "#imports";
import { definePlugin } from "@/utils/plugin";

let logos: HTMLAnchorElement[] | null = null;
const controller = new AbortController();

export default function init() {
  definePlugin(
    "homepageSwitcher",
    (settings) => {
      if (logos !== null) return;

      logos = Array.from(document.getElementsByClassName("logo")) as HTMLAnchorElement[];

      // add event listeners
      const closeCurrentTab = settings?.toggle.closeCurrentTab === true;
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
      if (logos === null) return;

      // remove event listeners
      controller.abort();

      logos = null;
    },
    [".logo"],
  );
}
