<script lang="ts">
  import Router from "svelte-spa-router";
  import active from "svelte-spa-router/active";
  import Home from "./routes/Home.svelte";
  import Plugins from "./routes/Plugins.svelte";
  import Themes from "./routes/Themes.svelte";
  import Snippets from "./routes/Snippets.svelte";
  import Banner from "./components/Banner.svelte";

  import { flavors } from "@catppuccin/palette";
  import { onMount, onDestroy } from "svelte";
  import { needsRefresh } from "@/utils/storage";

  const routes = {
    "/": Home,
    "/plugins": Plugins,
    "/themes": Themes,
    "/snippets": Snippets,
  };
  let flavour = $state("");
  let accent = "";
  let accentRgb = "";
  let settings = globalSettings.fallback;
  let refresh = $state(needsRefresh.fallback);

  async function refreshSchoolboxURLs() {
    logger.info("[App.svelte] Refreshing all Schoolbox URLs");
    const urls = (await schoolboxUrls.getValue()).map((url) => url.replace(/^https:\/\//, "*://") + "/*");
    const tabs = await browser.tabs.query({ url: urls });
    tabs.forEach((tab) => {
      browser.tabs.reload(tab.id);
    });
  }

  async function onBannerClick() {
    refresh = false;
    needsRefresh.setValue(refresh);
    refreshSchoolboxURLs();
  }

  function getAccentRgb(accent: string, flavour: string) {
    console.log(accent, flavour);
    console.log(flavors);
    console.log(flavors[flavour].colors);
    let x = (flavors as any)[flavour].colors[accent].rgb;
    return `${x.r}, ${x.g}, ${x.b}`;
  }

  let settingsUnwatch: () => void;
  let refreshUnwatch: () => void;

  onMount(async () => {
    settings = await globalSettings.getValue();
    refresh = await needsRefresh.getValue();
    accent = settings.themeAccent;
    flavour = settings.themeFlavour;
    accentRgb = getAccentRgb(accent, flavour);
    document.documentElement.style.setProperty("--ctp-accent", `rgb(${accentRgb})`);

    settingsUnwatch = globalSettings.watch((newValue) => {
      settings = newValue;
      flavour = newValue.themeFlavour;
      accent = newValue.themeAccent;
      accentRgb = getAccentRgb(accent, flavour);

      document.documentElement.style.setProperty("--ctp-accent", `rgb(${accentRgb})`);
      refresh = true;
      needsRefresh.setValue(refresh);
    });
    refreshUnwatch = needsRefresh.watch((newValue) => {
      refresh = newValue;
    });
  });

  onDestroy(() => {
    settingsUnwatch();
    refreshUnwatch();
  });
</script>

<main class="flex flex-col items-center bg-ctp-base p-6 ctp-{flavour}">
  <nav class="mb-4 flex rounded-xl px-4 py-2 text-ctp-text" id="navbar">
    <a href="#/" class="navbutton-left" use:active={{ className: "active" }}>Settings</a>
    <a href="#/plugins" class="navbutton-center" use:active={{ className: "active" }}>Plugins</a>
    <a href="#/themes" class="navbutton-center" use:active={{ className: "active" }}>Themes</a>
    <a href="#/snippets" class="navbutton-right" use:active={{ className: "active" }}>Snippets</a>
  </nav>
  <Banner visible={refresh} onclick={onBannerClick} />
  <Router {routes} />
</main>
