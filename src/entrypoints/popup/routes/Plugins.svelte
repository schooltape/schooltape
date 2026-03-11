<script lang="ts">
  import { globalSettings } from "@/utils/storage";
  import { Settings } from "@lucide/svelte";
  import Title from "../components/Title.svelte";
  import Button from "../components/inputs/Button.svelte";
  import Modal from "../components/Modal.svelte";
  import Toggle from "../components/inputs/Toggle.svelte";
  import { plugins } from "@/entrypoints/plugins.content";
  import type { PluginInstance } from "@/entrypoints/plugins.content";
  import { onMount } from "svelte";
  import type { Component } from "svelte";

  let showModal = $state(false);
  let components: Record<string, Component> = $state({});
  let selectedPlugin: PluginInstance | undefined = $state();
  let Menu = $derived(selectedPlugin ? components[selectedPlugin.meta.id] : undefined);

  onMount(async () => {
    for (const plugin of plugins) {
      if (!plugin.settings) continue;
      components[plugin.meta.id] = (await import(`@/entrypoints/plugins/${plugin.meta.id}/Menu.svelte`)).default;
    }
  });
</script>

<div id="card">
  <Title title="Plugins" bind:checked={globalSettings.state.plugins} />

  <div class="plugins-container">
    {#each plugins as plugin (plugin.meta.id)}
      <div class="group my-4">
        <Toggle
          id={plugin.meta.id}
          text={plugin.meta.name}
          description={plugin.meta.description}
          bind:checked={plugin.toggle.state.toggle}
          size="small">
          {#if plugin.settings}
            <Button
              title={plugin.meta.name + " Settings"}
              id={plugin.meta.id}
              onclick={() => {
                selectedPlugin = plugin;
                showModal = true;
              }}><Settings size={22} /></Button>
          {/if}
        </Toggle>
      </div>
    {/each}
  </div>
</div>

{#if selectedPlugin}
  <Modal bind:showModal>
    {#snippet header()}
      {#if selectedPlugin}
        <h2 class="mb-4 text-xl">{selectedPlugin.meta.name}</h2>
      {/if}
    {/snippet}
    <Menu settings={selectedPlugin.settings} />
  </Modal>
{/if}
