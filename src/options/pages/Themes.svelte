<script>
  import { onMount } from "svelte";

  let settings = {};
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

  onMount(async () => {
    chrome.storage.local.get(["settings"], function (result) {
      settings = result.settings;
    });
  });

  function toggleTheme() {
    settings.themes = !settings.themes;
    chrome.storage.local.set({ settings: settings });
  }

  function flavourClicked(flavour) {
    let currentAccent = settings.currentTheme.split("-")[2];
    let themeID = `catppuccin-${flavour}-${currentAccent}`;
    settings.currentTheme = themeID;
    chrome.storage.local.set({ settings: settings });
  }

  function accentClicked(accent) {
    let currentFlavour = settings.currentTheme.split("-")[1];
    let themeID = `catppuccin-${currentFlavour}-${accent}`;
    settings.currentTheme = themeID;
    chrome.storage.local.set({ settings: settings });
  }
</script>

<div id="card">
  <label class="relative flex justify-between items-center group p-2 text-xl text-ctp-text">
    <h2 class="from-blue to-teal">Themes</h2>
    <input
      id="theme-toggle"
      type="checkbox"
      class="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
      bind:checked={settings.themes}
      on:change={toggleTheme} />
    <span class="slider big"></span>
  </label>

  <div id="flavours" class="flex my-6 py-2 rounded-xl text-ctp-text">
    {#each flavours as flavour}
      <button
        class:navbutton-left={flavour === "latte"}
        class:navbutton-right={flavour === "mocha"}
        class:navbutton-center={(flavour === "macchiato") | (flavour === "frappe")}
        on:click={() => flavourClicked(flavour)}>{flavour}</button>
    {/each}
  </div>

  <div id="palette">
    {#each accents as accent}
      <button class="bg-ctp-{accent}" title={accent} on:click={() => accentClicked(accent)}></button>
    {/each}
  </div>
</div>
