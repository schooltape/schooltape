<script lang="ts">
  import { browser } from "#imports";
  import type { LogoId } from "@/utils/storage";
  import { globalSettings } from "@/utils/storage";
  import { LOGO_INFO } from "@/utils/constants";
  import { Palette } from "@lucide/svelte";

  import Title from "../components/Title.svelte";
  import Modal from "../components/Modal.svelte";
  import Button from "../components/inputs/Button.svelte";
  import Toggle from "../components/inputs/Toggle.svelte";
  import NavButton from "../components/NavButton.svelte";

  const flavours = ["latte", "frappe", "macchiato", "mocha"];
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

  const logos = LOGO_INFO;
  let showModal = $state(false);

  function cleanAccent(accent: string) {
    return accent.replace("bg-ctp-", "");
  }
</script>

<Modal bind:showModal>
  {#snippet header()}
    <h2 class="mb-4 text-xl">Choose an icon</h2>
  {/snippet}

  <div class="grid grid-cols-3 gap-4">
    {#each Object.entries(logos) as [logoId, logo] (logoId)}
      <button
        onclick={() => {
          globalSettings.update({ themeLogo: logoId as LogoId });
        }}
        class:highlight={globalSettings.state.themeLogo === logoId}
        class="flex flex-col rounded-lg border border-(--ctp-accent) p-2">
        <span>{logo.name}</span>
        {#if logo.disable !== true}
          <div class="flex h-full w-full items-center justify-center">
            {#if logo.adaptive}
              <!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
              <span class="logo-picker" style="--icon: url({browser.runtime.getURL(logo.url as any)})"></span>
            {:else}
              <img src={logo.url} alt="Logo" class="mt-2 w-16" />
            {/if}
          </div>
        {/if}
      </button>
    {/each}
  </div>

  <div class="mt-4">
    <Toggle
      update={(toggled) => {
        globalSettings.update({ themeLogoAsFavicon: toggled });
      }}
      checked={globalSettings.state.themeLogoAsFavicon}
      id="setAsFavicon"
      size="small"
      text="Set icon as tab favicon" />
  </div>
</Modal>

<div id="card">
  <Title
    title="Themes"
    checked={globalSettings.state.themes}
    update={(toggled: boolean) => {
      globalSettings.update({ themes: toggled });
    }} />

  <div
    id="flavours"
    class="text-ctp-text bg-ctp-surface0 outline-ctp-overlay2/20 my-6 flex overflow-clip rounded-xl outline-1 outline-solid">
    {#each flavours as flavour (flavour)}
      <button
        class="{globalSettings.state.themeFlavour === flavour
          ? 'bg-(--ctp-accent)/30'
          : 'hover:bg-(--ctp-accent)/10'} flex items-center p-2 transition-colors duration-300"
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
          globalSettings.update({ themeAccent: cleanAccent(accent) });
        }}></button>
    {/each}
  </div>

  <Button title="Choose icon" id="choose-icon" onclick={() => (showModal = true)}
    ><Palette size={22} /> Choose an icon</Button>
</div>
