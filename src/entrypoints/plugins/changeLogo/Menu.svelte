<script lang="ts">
  import Toggle from "@/entrypoints/popup/components/inputs/Toggle.svelte";
  import type { Settings } from ".";
  import { logos } from ".";

  let { settings }: { settings: Settings } = $props();
</script>

<div class="grid grid-cols-3 gap-4">
  {#await logos then logos}
    {#each Object.entries(logos) as [id, logo] (id)}
      <button
        onclick={() => settings.logo.set({ id: id as keyof typeof logos })}
        class:highlight={settings.logo.state.id === id}
        class="flex flex-col rounded-lg border border-(--ctp-accent) p-2">
        <span>{logo.name}</span>
        <div class="flex h-full w-full items-center justify-center">
          <img src={logo.url} alt="Logo" class="mt-2 w-16" />
        </div>
      </button>
    {/each}
  {/await}
</div>

<div class="mt-2">
  <Toggle
    text="Set as tab favicon"
    update={(toggle) => {
      settings.setAsFavicon.set({ toggle });
    }}
    checked={settings.setAsFavicon.state.toggle}
    size="small"
    id="setAsFavicon" />
</div>
