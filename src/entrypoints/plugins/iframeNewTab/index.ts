import { createShadowRootUi } from "#imports";
import { logger } from "@/utils/logger";
import { Plugin } from "@/utils/plugin";
import { mount, unmount } from "svelte";
import type App from "./App.svelte";

const ID = "iframeNewTab";

export default new Plugin<
  null,
  {
    Shortcut: typeof App;
  }
>(
  {
    id: ID,
    name: "Iframe New Tab",
    description: "Adds a shortcut to open all embedded iframes in a new tab.",
  },
  true,
  null,
  async (_settings, ctx, apps) => {
    if (!apps) {
      logger.error("iframe new tab expected app");
      return;
    }

    for (const iframe of document.querySelectorAll("iframe")) {
      const ui = await createShadowRootUi(ctx, {
        name: "schooltape-iframe-new-tab",
        position: "overlay",
        anchor: iframe.parentElement,
        zIndex: 1000,
        alignment: "top-right", // TODO
        onMount: (container) => {
          return mount(apps.Shortcut, {
            target: container,
            props: { href: iframe.src },
          });
        },
        onRemove: (app) => {
          if (app) unmount(app);
        },
      });

      ui.mount();

      console.log(ui.shadowHost);
    }
  },
  async () => {
    // document.querySelectorAll(`a[title="Open in new tab"]`).forEach((shortcut) => {
    //   shortcut.remove();
    // });
    // TODO: unmount
  },
  ["iframe"],
);
