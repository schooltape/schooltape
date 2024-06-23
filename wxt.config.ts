import { defineConfig } from "wxt";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "Schooltape",
    homepage_url: "https://schooltape.github.io",
    web_accessible_resources: [
      {
        matches: ["<all_urls>"],
        resources: ["*"],
      },
    ],
    host_permissions: ["http://*/*", "https://*/*"],
    permissions: ["storage", "contextMenus", "activeTab", "scripting", "notifications"],
  },
  srcDir: "src",
  // TODO
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
