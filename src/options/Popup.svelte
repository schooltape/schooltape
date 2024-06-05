<script>
  import { Route, router } from "tinro";
  import { active } from "tinro";
  import Home from "./pages/Home.svelte";
  import Plugins from "./pages/Plugins.svelte";
  import Themes from "./pages/Themes.svelte";
  import Snippets from "./pages/Snippets.svelte";
  import { onMount } from "svelte";

  let flavour = "macchiato";
  router.mode.hash(); // enables hash navigation method

  onMount(async () => {
    const storage = await browser.storage.local.get("themes");
    flavour = storage.themes.flavour;
  });
</script>

<body class="grid ctp-{flavour}">
  <main class="flex flex-col items-center bg-gradient-to-b from-ctp-base to-ctp-crust p-6">
    <div class="mb-6 flex rounded-xl px-4 py-2 text-ctp-text" id="navbar">
      <a href="/" use:active exact class="navbutton-left">Settings</a>
      <a href="/plugins" use:active class="navbutton-center">Plugins</a>
      <a href="/themes" use:active class="navbutton-center">Themes</a>
      <a href="/snippets" use:active class="navbutton-right">Snippets</a>
    </div>
    <Route fallback path="/"><Home /></Route>
    <Route path="/plugins"><Plugins /></Route>
    <Route path="/themes"><Themes /></Route>
    <Route path="/snippets"><Snippets /></Route>
  </main>
</body>
