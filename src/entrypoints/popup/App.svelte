<script lang="ts">
  import { flavors } from "@catppuccin/palette";
  import { globalSettings, updated } from "@/utils/storage";
  import { browser, onMount } from "#imports";

  import Router from "svelte-spa-router";
  import active from "svelte-spa-router/active";
  import Home from "./routes/Home.svelte";
  import Plugins from "./routes/Plugins.svelte";
  import Themes from "./routes/Themes.svelte";
  import Snippets from "./routes/Snippets.svelte";

  const routes = {
    "/": Home,
    "/plugins": Plugins,
    "/themes": Themes,
    "/snippets": Snippets,
  };

  function getAccentRgb(accent: string, flavour: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let x = (flavors as any)[flavour].colors[accent].rgb;
    return `rgb(${x.r}, ${x.g}, ${x.b})`;
  }

  let accentRgb = $derived(getAccentRgb(globalSettings.state.themeAccent, globalSettings.state.themeFlavour));

  onMount(() => {
    updated.update({ icon: false });
    browser.runtime.sendMessage({ updateIcon: true });
  });
</script>

<main
  class="bg-ctp-base flex flex-col items-center p-6 {globalSettings.state.themeFlavour}"
  style="--ctp-accent: {accentRgb}">
  <nav class="text-ctp-text mb-4 flex rounded-xl px-4 py-2" id="navbar">
    <a href="#/" class="navbutton-left" use:active={{ className: "active" }}>Settings</a>
    <a href="#/plugins" class="navbutton-center" use:active={{ className: "active" }}>Plugins</a>
    <a href="#/themes" class="navbutton-center" use:active={{ className: "active" }}>Themes</a>
    <a href="#/snippets" class="navbutton-right" use:active={{ className: "active" }}>Snippets</a>
  </nav>

  <Router {routes} />
</main>
