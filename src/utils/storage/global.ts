import { storage } from "#imports";
import { StorageState } from "./state.svelte";
import type * as Types from "./types";

export const globalSettings = new StorageState<Types.Settings>(
  storage.defineItem<Types.Settings>("local:globalSettings", {
    fallback: {
      global: true,
      plugins: true,
      themes: true,
      snippets: true,

      themeFlavour: "mocha",
      themeAccent: "mauve",
      themeLogo: "schooltape-rainbow",
      themeLogoAsFavicon: false,

      userSnippets: {},
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
      urls: ["help.schoolbox.com.au"],
    },
    migrations: {
      2: (oldValue) => oldValue.urls.map((url: string) => url.replace(/^https?:\/\//, "")),
    },
  }),
);
