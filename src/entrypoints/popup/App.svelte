<script lang="ts">
  import Router from "svelte-spa-router";
  import active from "svelte-spa-router/active";
  import Home from "./routes/Home.svelte";
  import Plugins from "./routes/Plugins.svelte";
  import Themes from "./routes/Themes.svelte";
  import Snippets from "./routes/Snippets.svelte";
  import { onMount, onDestroy } from "svelte";

  const routes = {
    "/": Home,
    "/plugins": Plugins,
    "/themes": Themes,
    "/snippets": Snippets,
  };

  let flavour = "macchiato";
  let unwatch: () => void;

  onMount(async () => {
    unwatch = themeSettings.watch((newValue) => {
      flavour = newValue.flavour;
    });
  });

  onDestroy(() => {
    unwatch();
  });
</script>

<body class="grid ctp-{flavour}">
  <main class="flex flex-col items-center bg-ctp-base p-6">
    <nav class="mb-6 flex rounded-xl px-4 py-2 text-ctp-text" id="navbar">
      <a href="#/" class="navbutton-left" use:active={{ className: "active" }}>Settings</a>
      <a href="#/plugins" class="navbutton-center" use:active={{ className: "active" }}>Plugins</a>
      <a href="#/themes" class="navbutton-center" use:active={{ className: "active" }}>Themes</a>
      <a href="#/snippets" class="navbutton-right" use:active={{ className: "active" }}>Snippets</a>
    </nav>
    <Router {routes} />
  </main>
</body>
