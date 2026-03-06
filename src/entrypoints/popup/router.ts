import { createRouter } from "sv-router";

export const { p, navigate, isActive, route } = createRouter({
  "/": () => import("./routes/Home.svelte"),
  "/plugins": () => import("./routes/Plugins.svelte"),
  "/themes": () => import("./routes/Themes.svelte"),
  "/snippets": {
    "/": () => import("./routes/Snippets.svelte"),
    "/(quick)": () => import("./routes/QuickCSS.svelte"),
  },
  "/account": {
    "/": () => import("./routes/Account.svelte"),
    "/login": () => import("./routes/Login.svelte"),
    "/signup": () => import("./routes/Signup.svelte"),
  },
  layout: () => import("./routes/Layout.svelte"),
});
