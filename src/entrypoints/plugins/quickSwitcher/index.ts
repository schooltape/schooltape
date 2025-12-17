import { createShadowRootUi } from "#imports";
import { logger } from "@/utils/logger";
import { Plugin } from "@/utils/plugin";
import { mount, unmount } from "svelte";

export type Settings = {};

let mounted = false;

export default new Plugin<Settings>(
  {
    id: "quickSwitcher",
    name: "Quick Switcher",
    description: "Search homepages, news items quickly.", // TODO
  },
  true,
  null,
  async (ctx) => {
    const App = (await import("./App.svelte")).default;

    const ui = await createShadowRootUi(ctx, {
      name: "schooltape-quick-switcher",
      position: "modal",
      anchor: "body",
      onMount: (container) => {
        return mount(App, { target: container });
      },
      onRemove: (app) => {
        if (app) unmount(app);
      },
    });

    document.addEventListener("keydown", (event) => {
      // console.log(event);
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        // open popup
        if (mounted) {
          ui.remove();
        } else {
          logger.info("mounting");
          ui.mount();
        }
        mounted = !mounted;
      }
    });
  },
  () => {},
  [],
);
