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
  <Title title="Themes" bind:checked={globalSettings.state.themes} />

  <div
    id="flavours"
    class="text-ctp-text bg-ctp-surface0 outline-ctp-overlay2/20 my-6 flex overflow-clip rounded-xl outline-1 outline-solid">
    {#each flavours as flavour (flavour)}
      <button
        class="{globalSettings.state.themeFlavour === flavour
          ? 'bg-(--ctp-accent)/30'
          : 'hover:bg-(--ctp-accent)/10'} flex items-center p-2 transition-colors duration-300"
        onclick={() => {
          globalSettings.state.themeFlavour = flavour;
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
          globalSettings.state.themeAccent = cleanAccent(accent) as Accent;
        }}></button>
    {/each}
  </div>
</div>
