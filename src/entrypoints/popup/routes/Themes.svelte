<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";
  import Modal from "../components/Modal.svelte";
  import IconBtn from "../components/inputs/IconBtn.svelte";
  import { Layers3 } from "lucide-svelte";

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
  let settings = $state(globalSettings.fallback);
  let showModal = $state(false);

  onMount(async () => {
    settings = await globalSettings.getValue();
  });

  async function flavourClicked(flavour: string) {
    settings.themeFlavour = flavour;
    await globalSettings.setValue($state.snapshot(settings));
  }

  function cleanAccent(accent: string) {
    return accent.replace("bg-ctp-", "");
  }

  async function accentClicked(accent: string) {
    settings.themeAccent = cleanAccent(accent);
    await globalSettings.setValue($state.snapshot(settings));
  }

  async function logoClicked(logoId: string) {
    settings.themeLogo = logoId as LogoId;
    await globalSettings.setValue($state.snapshot(settings));
  }

  async function handleToggleChange(event: CustomEvent) {
    let settings = await globalSettings.getValue();
    settings.themes = event.detail.checked;
    await globalSettings.setValue($state.snapshot(settings));
  }
</script>

<Modal bind:showModal>
  {#snippet header()}
    <h2 class="mb-4 text-xl">Choose an icon</h2>
  {/snippet}

  <div class="grid grid-cols-3 gap-4">
    {#each Object.entries(logos) as [logoId, logo] (logoId)}
      <button
        onclick={() => logoClicked(logoId)}
        class:highlight={settings.themeLogo === logoId}
        class="border border-(--ctp-accent) p-2 flex flex-col items-center justify-between rounded-lg">
        <span>{logo.name}</span>
        {#if logo.disable !== true}
          {#if logo.adaptive}
            <span class="logo-picker" style="--icon: url({logo.url})"></span>
          {:else}
            <img src={logo.url} alt="Logo" class="h-16 mt-2" />
          {/if}
        {/if}
      </button>
    {/each}
  </div>
</Modal>

<div id="card">
  <Title title="Themes" bind:checked={settings.themes} on:change={handleToggleChange} />

  <div id="flavours" class="flex my-6 py-2 rounded-xl text-ctp-text">
    {#each flavours as flavour (flavour)}
      <button
        class:active={settings.themeFlavour === flavour}
        class:navbutton-left={flavour === "latte"}
        class:navbutton-right={flavour === "mocha"}
        class:navbutton-center={flavour === "macchiato" || flavour === "frappe"}
        onclick={() => flavourClicked(flavour)}>{flavour}</button>
    {/each}
  </div>

  <div id="palette">
    {#each accents as accent (accent)}
      <button
        class={accent}
        class:current={settings.themeAccent === cleanAccent(accent)}
        aria-label={cleanAccent(accent)}
        title={cleanAccent(accent)}
        onclick={() => accentClicked(accent)}></button>
    {/each}
  </div>

  <IconBtn
    title="Choose icon"
    id="choose-icon"
    onClick={() => (showModal = true)}
    icon={Layers3}
    label="Choose an icon" />
</div>
