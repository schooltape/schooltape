import { defineConfig } from "wxt";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "Schooltape",
    web_accessible_resources: [
      {
        matches: ["<all_urls>"],
        resources: ["*"],
      },
    ],
    permissions: ["storage", "contextMenus", "activeTab", "scripting", "webRequest", "notifications", "background"],
  },
  srcDir: "src",
  vite: () => ({
    plugins: [
      svelte({
        // Using a svelte.config.js file causes a segmentation fault when importing the file
        configFile: false,
        preprocess: [vitePreprocess()],
      }),
    ],
  }),
});
