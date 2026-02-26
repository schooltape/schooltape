import { storage } from "#imports";
import type { Settings as LogoSettings } from "@/entrypoints/plugins/changeLogo";
import { StorageState } from "./state.svelte";
import type * as Types from "./types";

export const global = new StorageState(
  storage.defineItem<boolean>("local:global", {
    fallback: true,
  }),
);

export const plugins = new StorageState(
  storage.defineItem<boolean>("local:plugins", {
    fallback: true,
  }),
);

export const themes = new StorageState(
  storage.defineItem<Types.ThemesV1>("local:themes", {
    fallback: {
      toggle: true,
      flavour: "mocha",
      accent: "mauve",
    },
  }),
);

export const snippets = new StorageState(
  storage.defineItem<Types.SnippetsV1>("local:snippets", {
    fallback: {
      toggle: true,
      snippets: {},
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

export const auth = new StorageState(
  storage.defineItem<Types.Auth>("local:auth", {
    version: 1,
    fallback: {
      loggedIn: false,
    },
  }),
);

storage.defineItem<null>("local:globalSettings", {
  version: 3,
  migrations: {
    2: async (settings: Types.SettingsV1) => {
      const { themeLogo, themeLogoAsFavicon, ...rest } = settings;

      // dynamic import to avoid TDZ error
      const { pluginInstances: plugins } = await import("@/entrypoints/plugins.content");
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
    3: async (settings: Types.SettingsV2) => {
      global.set(settings.global);
      plugins.set(settings.plugins);
      themes.set({
        toggle: settings.themes,
        accent: settings.themeAccent,
        flavour: settings.themeFlavour,
      });
      snippets.update({ toggle: settings.snippets });

      quickCSS.set({
        toggle: settings.snippets,
        value: Object.values(settings.userSnippets)
          .map(
            (snippet) => `/* ${snippet.name} */
${snippet.toggle ? "" : "/* "}@import url("${snippet.url}");${snippet.toggle ? "" : " */"}`,
          )
          .join("\n\n"),
      });

      return null;
    },
  },
});
