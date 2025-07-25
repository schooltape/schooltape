<script lang="ts">
  import Router from "svelte-spa-router";
  import active from "svelte-spa-router/active";
  import Home from "./routes/Home.svelte";
  import Plugins from "./routes/Plugins.svelte";
  import Themes from "./routes/Themes.svelte";
  import Snippets from "./routes/Snippets.svelte";
  import Banner from "./components/Banner.svelte";

  import { flavors } from "@catppuccin/palette";
  import { needsRefresh } from "@/utils/storage";
  import { globalSettings } from "#imports";
  import { RotateCw } from "@lucide/svelte";

  const routes = {
    "/": Home,
    "/plugins": Plugins,
    "/themes": Themes,
    "/snippets": Snippets,
  };

  async function refreshSchoolboxURLs() {
    logger.info("[App.svelte] Refreshing all Schoolbox URLs");
    const urls = (await schoolboxUrls.storage.getValue()).urls.map((url) => url.replace(/^https:\/\//, "*://") + "/*");
    const tabs = await browser.tabs.query({ url: urls });
    tabs.forEach((tab) => {
      if (tab.id) {
        browser.tabs.reload(tab.id);
      }
    });
  }

  function getAccentRgb(accent: string, flavour: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let x = (flavors as any)[flavour].colors[accent].rgb;
    return `rgb(${x.r}, ${x.g}, ${x.b})`;
  }

  let accentRgb = $derived(getAccentRgb(globalSettings.state.themeAccent, globalSettings.state.themeFlavour));
</script>

<main
  class="flex flex-col items-center bg-ctp-base p-6 {globalSettings.state.themeFlavour}"
  style="--ctp-accent: {accentRgb}">
  <nav class="mb-4 flex rounded-xl px-4 py-2 text-ctp-text" id="navbar">
    <a href="#/" class="navbutton-left" use:active={{ className: "active" }}>Settings</a>
    <a href="#/plugins" class="navbutton-center" use:active={{ className: "active" }}>Plugins</a>
    <a href="#/themes" class="navbutton-center" use:active={{ className: "active" }}>Themes</a>
    <a href="#/snippets" class="navbutton-right" use:active={{ className: "active" }}>Snippets</a>
  </nav>

  <Banner
    message="Click here to apply changes"
    visible={needsRefresh.state}
    onclick={() => {
      needsRefresh.storage.setValue(false);
      refreshSchoolboxURLs();
    }}><RotateCw /></Banner>

  <Router {routes} />
</main>
