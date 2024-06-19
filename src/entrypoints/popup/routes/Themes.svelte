<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";
  import Modal from "../components/Modal.svelte";
  import { Layers3 } from "lucide-svelte";

  let isLoaded = false;
  const flavours = ["latte", "frappe", "macchiato", "mocha"];
  const accents = [
    "rosewater",
    "flamingo",
    "pink",
    "mauve",
    "red",
    "maroon",
    "peach",
    "yellow",
    "green",
    "teal",
    "sky",
    "sapphire",
    "blue",
    "lavender",
  ];
  let themes = themeSettings.defaultValue;
  let showModal = false;
  let logos: LogoDetailsV1[] = [
    {
      name: "Default",
      url: "default",
      id: "default",
      disable: true,
    },
    {
      name: "Catppuccin",
      id: "catppuccin",
      url: "https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png",
    },
    {
      name: "Schoolbox",
      id: "schoolbox",
      url: "https://schooltape.github.io/schoolbox.svg",
    },
    {
      name: "Schooltape",
      id: "st",
      url: "https://schooltape.github.io/schooltape.svg",
    },
    {
      name: "ST Rainbow",
      id: "st-rainbow",
      url: "https://schooltape.github.io/schooltape-ctp.svg",
    },
    {
      name: "ST Legacy",
      id: "st-legacy",
      url: "https://schooltape.github.io/schooltape-legacy.svg",
    },
  ];

  // TODO
  let logosAdaptive: LogoDetailsV1[] = [
    {
      name: "Default",
      url: "default",
      id: "default",
      disable: true,
    },
    {
      name: "Catppuccin",
      id: "catppuccin",
      url: "https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png",
    },
    {
      name: "Home",
      id: "home",
      url: "https://fonts.gstatic.com/s/i/materialiconsround/home/v16/24px.svg",
    },
  ];

  onMount(async () => {
    themes = await themeSettings.getValue();
    console.log("themes", themes);
  });

  function flavourClicked(flavour: string) {
    themes.flavour = flavour;
    themeSettings.setValue(themes);
  }

  function accentClicked(accent: string) {
    themes.accent = accent;
    themeSettings.setValue(themes);
  }
  function logoClicked(logo: LogoDetailsV1) {
    console.log(logo);
    themes.logo = logo;
    console.log(themes);
    themeSettings.setValue(themes);
  }
</script>

<Modal bind:showModal>
  <h2 slot="header" class="mb-10 text-xl">Choose an icon</h2>

  <div class="grid grid-cols-3 gap-4">
    {#each logos as logo (logo)}
      <button
        on:click={() => logoClicked(logo)}
        class:highlight={themes.logo.id === logo.id}
        class="border border-ctp-pink p-2 flex flex-col items-center justify-between rounded-lg">
        <span>{logo.name}</span>
        {#if logo.disable !== true}
          <img src={logo.url} alt="Logo" class="h-16 mt-2" />
        {/if}
      </button>
    {/each}
  </div>
  <br />
  <!-- TODO -->
  <h3 class="text-lg font-bold">Coming soon™</h3>
  <p>Adaptive SVG logos that change based on your theme!</p>
</Modal>

<div id="card">
  <Title title="Themes" data={themes} key="themes" />

  <div id="flavours" class="flex my-6 py-2 rounded-xl text-ctp-text">
    {#each flavours as flavour}
      <button
        class:active={themes.flavour === flavour}
        class:navbutton-left={flavour === "latte"}
        class:navbutton-right={flavour === "mocha"}
        class:navbutton-center={flavour === "macchiato" || flavour === "frappe"}
        on:click={() => flavourClicked(flavour)}>{flavour}</button>
    {/each}
  </div>

  <div id="palette">
    {#each accents as accent}
      <button
        class="bg-ctp-{accent}"
        class:current={themes.accent === accent}
        title={accent}
        on:click={() => accentClicked(accent)}></button>
    {/each}
  </div>

  <button
    title="Choose icon"
    id="choose-icon"
    class="flex items-center mx-2 small hover:bg-ctp-pink hover:text-ctp-crust"
    on:click={() => (showModal = true)}>
    <Layers3 />
    <span class="ml-3">Choose an icon</span>
  </button>
</div>
