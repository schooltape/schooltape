<script lang="ts">
  import { globalSettings } from "@/utils/storage";
  import type { Accent, Flavour } from "@/utils/storage";

  import Title from "../components/Title.svelte";

  const flavours: Flavour[] = ["latte", "frappe", "macchiato", "mocha"];
  const accents = [
    "bg-ctp-rosewater",
    "bg-ctp-flamingo",
    "bg-ctp-pink",
    "bg-ctp-mauve",
    "bg-ctp-red",
    "bg-ctp-maroon",
    "bg-ctp-peach",
    "bg-ctp-yellow",
    "bg-ctp-green",
    "bg-ctp-teal",
    "bg-ctp-sky",
    "bg-ctp-sapphire",
    "bg-ctp-blue",
    "bg-ctp-lavender",
  ];

  function cleanAccent(accent: string) {
    return accent.replace("bg-ctp-", "");
  }
</script>

<div id="card">
  <Title
    title="Themes"
    checked={globalSettings.state.themes}
    update={(toggled: boolean) => {
      globalSettings.update({ themes: toggled });
    }} />

  <div id="flavours" class="text-ctp-text my-6 flex rounded-xl py-2">
    {#each flavours as flavour (flavour)}
      <button
        class:active={globalSettings.state.themeFlavour === flavour}
        class:navbutton-left={flavour === "latte"}
        class:navbutton-right={flavour === "mocha"}
        class:navbutton-center={flavour === "macchiato" || flavour === "frappe"}
        onclick={() => {
          globalSettings.update({ themeFlavour: flavour });
        }}>{flavour}</button>
    {/each}
  </div>

  <div id="palette">
    {#each accents as accent (accent)}
      <button
        class={accent}
        class:current={globalSettings.state.themeAccent === cleanAccent(accent)}
        aria-label={cleanAccent(accent)}
        title={cleanAccent(accent)}
        onclick={() => {
          globalSettings.update({ themeAccent: cleanAccent(accent) as Accent });
        }}></button>
    {/each}
  </div>
</div>
