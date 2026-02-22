import { storage } from "#imports";
import type { Settings as LogoSettings } from "@/entrypoints/plugins/changeLogo";
import { StorageState } from "./state.svelte";
import type * as Types from "./types";

export const globalSettings = new StorageState(
  storage.defineItem<Types.SettingsV3>("local:globalSettings", {
    version: 2,
    fallback: {
      global: true,
      plugins: true,
      themes: true,
      snippets: true,

      themeFlavour: "mocha",
      themeAccent: "mauve",
    },
    migrations: {
      2: async (settings: Types.SettingsV1) => {
        const { themeLogo, themeLogoAsFavicon, ...rest } = settings;

        // dynamic import to avoid TDZ error
        const { plugins } = await import("@/entrypoints/plugins.content");
        const changeLogo = plugins.find((plugin) => plugin.meta.id === "changeLogo");

        if (changeLogo) {
          const changeLogoSettings = changeLogo.settings as LogoSettings;
          if (themeLogo !== "default") {
            // update logo
            changeLogoSettings.logo.set({ id: themeLogo });
          } else {
            // disable changeLogo
            changeLogo.toggle.set({ toggle: false });
          }
          changeLogoSettings.setAsFavicon.set({ toggle: themeLogoAsFavicon });
        }

        return rest;
      },
    },
  }),
);

// whether schooltape was recently updated
export const updated = new StorageState(
  storage.defineItem<Types.UpdatedBadges>("local:updated", {
    version: 2,
    fallback: {
      icon: false,
      changelog: false,
    },
    migrations: {
      2: async () => {
        // reset to fallback
        await storage.removeItem("local:updated");
      },
    },
  }),
);

// message of the day
export const motd = new StorageState(
  storage.defineItem<Types.Motd>("local:motd", {
    fallback: {
      motd: "Free and <a href='https://github.com/schooltape/schooltape' class='text-(--ctp-accent)'> open source</a>!",
    },
  }),
);

export const schoolboxUrls = new StorageState(
  storage.defineItem<Types.SchoolboxUrls>("local:urls", {
    version: 1,
    fallback: {
      urls: ["https://help.schoolbox.com.au"],
    },
  }),
);

export const quickCSS = new StorageState(
  storage.defineItem<Types.QuickCSS>("local:quickCSS", {
    version: 1,
    fallback: {
      toggle: true,
      value: "",
    },
  }),
);

export const auth = new StorageState(
  storage.defineItem<Types.Auth>("local:auth", {
    version: 1,
    fallback: {
      loggedIn: false,
    },
  }),
);
