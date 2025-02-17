<script lang="ts">
  import Router from "svelte-spa-router";
  import active from "svelte-spa-router/active";
  import Home from "./routes/Home.svelte";
  import Plugins from "./routes/Plugins.svelte";
  // import Themes from "./routes/Themes.svelte";
  // import Snippets from "./routes/Snippets.svelte";
  import Banner from "./components/Banner.svelte";

  import { flavors } from "@catppuccin/palette";
  import { onMount, onDestroy } from "svelte";

  const routes = {
    "/": Home,
    "/plugins": Plugins,
    // "/themes": Themes,
    // "/snippets": Snippets,
  };
  let flavour = "";
  let accent = "";
  let accentHex = "";
  let settings = globalSettings.fallback;

  async function refreshSchoolboxURLs() {
    logger.info("[App.svelte] Refreshing all Schoolbox URLs");
    // @ts-ignore
    const urls = (await globalSettings.getValue()).urls.map((url) => url.replace(/^https:\/\//, "*://") + "/*");
    const tabs = await browser.tabs.query({ url: urls });
    tabs.forEach((tab) => {
      browser.tabs.reload(tab.id);
    });
  }

  async function onBannerClick() {
    hideBanner();
    refreshSchoolboxURLs();
  }

  function showBanner() {
    settings.needsRefresh = true;
    globalSettings.setValue(settings);
  }

  function hideBanner() {
    settings.needsRefresh = false;
    globalSettings.setValue(settings);
  }

  function getAccentHex(accent: string, flavour: string) {
    // console.log(accent, flavour);
    // console.log(flavors);
    // console.log(flavors[flavour].colors[accent].hex);
    let x = (flavors as any)[flavour].colors[accent].rgb;
    return `${x.r}, ${x.g}, ${x.b}`;
  }

  let settingsUnwatch: () => void;

  onMount(async () => {
    settings = await globalSettings.getValue();
    accentHex = getAccentHex(settings.themeAccent, settings.themeFlavour);
    document.documentElement.style.setProperty("--ctp-accent", accentHex);
    // TODO)) make sure changing plugins also triggers the banner
    // @ts-ignore
    settingsUnwatch = globalSettings.watch((newValue, oldValue) => {
      settings = newValue;
      flavour = newValue.themeFlavour;
      accent = newValue.themeAccent;

      accentHex = getAccentHex(accent, flavour);

      document.documentElement.style.setProperty("--ctp-accent", accentHex);
      // showBanner();
    });
  });

  onDestroy(() => {
    settingsUnwatch();
  });
</script>

<body class="grid ctp-{flavour}">
  <main class="flex flex-col items-center bg-ctp-base p-6">
    <nav class="mb-4 flex rounded-xl px-4 py-2 text-ctp-text" id="navbar">
      <a href="#/" class="navbutton-left" use:active={{ className: "active" }}>Settings</a>
      <a href="#/plugins" class="navbutton-center" use:active={{ className: "active" }}>Plugins</a>
      <a href="#/themes" class="navbutton-center" use:active={{ className: "active" }}>Themes</a>
      <a href="#/snippets" class="navbutton-right" use:active={{ className: "active" }}>Snippets</a>
    </nav>
    <Banner visible={settings.needsRefresh} on:click={onBannerClick} />
    <Router {routes} />
  </main>

  <!-- DEBUG
  <button on:click={showBanner}>Show Banner</button>
  <button on:click={hideBanner}>Hide Banner</button> -->
</body>
