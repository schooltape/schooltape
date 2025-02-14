import * as Types from "./types";

// Global settings
export const settings = storage.defineItem<Types.Settings>("local:globalSettings", {
  version: 1,
  fallback: {
    global: true,
    plugins: true,
    themes: true,
    snippets: true,

    themeFlavour: "mocha",
    themeAccent: "mauve",
    themeLogo: "schooltape-rainbow",

    userSnippets: {},
    urls: ["https://help.schoolbox.com.au"],
    needsRefresh: false,
  },
});
