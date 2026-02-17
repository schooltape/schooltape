import { createRouter } from "sv-router";
import Account from "./routes/Account.svelte";
import Home from "./routes/Home.svelte";
import Login from "./routes/Login.svelte";
import Plugins from "./routes/Plugins.svelte";
import Signup from "./routes/Signup.svelte";
import Snippets from "./routes/Snippets.svelte";
import Themes from "./routes/Themes.svelte";

export const { p, navigate, isActive, route } = createRouter({
  "/account": Account,
  "/account/login": Login,
  "/account/signup": Signup,
  "/": Home,
  "/plugins": Plugins,
  "/themes": Themes,
  "/snippets": Snippets,
});
