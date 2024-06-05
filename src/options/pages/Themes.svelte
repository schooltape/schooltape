<script>
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";

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
  let themes = {
    toggle: false,
  }

  onMount(async () => {
    const result = await browser.storage.local.get();
    themes = result.themes;
    console.log("themes", themes);
  });

  function toggleTheme() {
    chrome.storage.local.set({ themes: themes });
  }

  function flavourClicked(flavour) {
    themes.flavour = flavour;
    chrome.storage.local.set({ themes: themes });
  }

  function accentClicked(accent) {
    themes.accent = accent;
    chrome.storage.local.set({ themes: themes });
  }
</script>

<div id="card">
  <label class="relative flex justify-between items-center group p-2 text-xl text-ctp-text">
    <h2 class="from-blue to-teal">Themes</h2>
    <input
      id="theme-toggle"
      type="checkbox"
      class="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
      bind:checked={themes.toggle}
      on:change={toggleTheme} />
    <span class="slider big"></span>
  </label>

  <div id="flavours" class="flex my-6 py-2 rounded-xl text-ctp-text">
    {#each flavours as flavour}
      <button
        class:active={themes.flavour === flavour}
        class:navbutton-left={flavour === "latte"}
        class:navbutton-right={flavour === "mocha"}
        class:navbutton-center={(flavour === "macchiato") | (flavour === "frappe")}
        on:click={() => flavourClicked(flavour)}>{flavour}</button>
    {/each}
  </div>

  <div id="palette">
    {#each accents as accent}
      <button class="bg-ctp-{accent}" class:current={themes.accent === accent} title={accent} on:click={() => accentClicked(accent)}></button>
    {/each}
  </div>
</div>
