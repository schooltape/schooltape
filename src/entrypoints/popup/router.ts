import { createRouter } from "sv-router";
import Layout from "./routes/Layout.svelte";
import Account from "./routes/Account.svelte";
import Home from "./routes/Home.svelte";
import Login from "./routes/Login.svelte";
import Plugins from "./routes/Plugins.svelte";
import Signup from "./routes/Signup.svelte";
import Snippets from "./routes/Snippets.svelte";
import QuickCSS from "./routes/QuickCSS.svelte";
import Themes from "./routes/Themes.svelte";

export const { p, navigate, isActive, route } = createRouter({
  "/": Home,
  "/plugins": Plugins,
  "/themes": Themes,
  "/snippets": {
    "/": Snippets,
    "/(quick)": QuickCSS,
  },
  "/account": {
    "/": Account,
    "/login": Login,
    "/signup": Signup,
  },
  layout: Layout,
});
