import { createRouter } from "sv-router";

export const { p, navigate, isActive, route } = createRouter({
  "/": () => import("./routes/Home.svelte"),
  "/plugins": () => import("./routes/Plugins.svelte"),
  "/themes": () => import("./routes/Themes.svelte"),
  "/quickcss": () => import("./routes/QuickCss.svelte"),
  layout: () => import("./routes/Layout.svelte"),
});
