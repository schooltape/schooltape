import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  imports: {
    eslintrc: {
      enabled: 9,
    },
  },
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
  outDir: "dist",
  modules: ["@wxt-dev/module-svelte"],
});
