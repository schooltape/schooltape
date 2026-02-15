import { createRouter } from "sv-router";
import Account from "./routes/Account.svelte";
import Home from "./routes/Home.svelte";
import Plugins from "./routes/Plugins.svelte";
import Snippets from "./routes/Snippets.svelte";
import Themes from "./routes/Themes.svelte";

export const { p, navigate, isActive, route } = createRouter({
  "/account": Account,
  "/": Home,
  "/plugins": Plugins,
  "/themes": Themes,
  "/snippets": Snippets,
});
