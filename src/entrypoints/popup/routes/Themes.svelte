<script lang="ts">
  import Title from "../components/Title.svelte";
  import Modal from "../components/Modal.svelte";
  import IconBtn from "../components/inputs/IconBtn.svelte";
  import { Layers3 } from "lucide-svelte";
  import { globalSettings } from "#imports";
  import { PublicPath } from "wxt/browser";

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
          globalSettings.set({ themeLogo: logoId as LogoId });
        }}
        class:highlight={globalSettings.state.themeLogo === logoId}
        class="border border-(--ctp-accent) p-2 flex flex-col items-center justify-between rounded-lg">
        <span>{logo.name}</span>
        {#if logo.disable !== true}
          {#if logo.adaptive}
            <span class="logo-picker" style="--icon: url({browser.runtime.getURL(logo.url as PublicPath)})"></span>
          {:else}
            <img src={logo.url} alt="Logo" class="h-16 mt-2" />
          {/if}
        {/if}
      </button>
    {/each}
  </div>
</Modal>

<div id="card">
  <Title
    title="Themes"
    checked={globalSettings.state.themes}
    update={(toggled: boolean) => {
      globalSettings.set({ themes: toggled });
    }} />

  <div id="flavours" class="flex my-6 py-2 rounded-xl text-ctp-text">
    {#each flavours as flavour (flavour)}
      <button
        class:active={globalSettings.state.themeFlavour === flavour}
        class:navbutton-left={flavour === "latte"}
        class:navbutton-right={flavour === "mocha"}
        class:navbutton-center={flavour === "macchiato" || flavour === "frappe"}
        onclick={() => {
          globalSettings.set({ themeFlavour: flavour });
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
          globalSettings.set({ themeAccent: cleanAccent(accent) });
        }}></button>
    {/each}
  </div>

  <IconBtn title="Choose icon" id="choose-icon" onclick={() => (showModal = true)} label="Choose an icon"
    ><Layers3 /></IconBtn>
</div>
