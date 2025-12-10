<script lang="ts">
  import type { PluginId } from "@/utils/storage";
  import { globalSettings, plugins } from "@/utils/storage";
  import { Settings } from "@lucide/svelte";
  import Title from "../components/Title.svelte";
  import Button from "../components/inputs/Button.svelte";
  import Modal from "../components/Modal.svelte";
  import Toggle from "../components/inputs/Toggle.svelte";
  import Slider from "../components/inputs/Slider.svelte";

  let showModal = $state(false);
  let selectedPluginId: PluginId | undefined = $state();
  let selectedPlugin = $derived.by(() => {
    if (selectedPluginId !== undefined) {
      return plugins[selectedPluginId];
    }
  });
</script>

<div id="card">
  <Title
    title="Plugins"
    checked={globalSettings.state.plugins}
    update={(toggled: boolean) => {
      globalSettings.update({ plugins: toggled });
    }} />

  <div class="plugins-container">
    {#each Object.entries(plugins) as [id, plugin] (id)}
      <div class="group my-4">
        <Toggle
          {id}
          checked={plugin.toggle.state.toggle}
          update={(toggled: boolean) => {
            plugin.toggle.set({ toggle: toggled });
          }}
          text={plugin.name}
          description={plugin.description}
          size="small">
          {#if plugin.settings !== undefined}
            <Button
              title={plugin.name + " Settings"}
              {id}
              onclick={() => {
                selectedPluginId = id as PluginId;
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
      <h2 class="mb-4 text-xl">{selectedPlugin.name}</h2>
    {/snippet}
    {#if selectedPlugin.settings !== undefined}
      {#each Object.entries(selectedPlugin.settings) as [id, setting] (id)}
        {#if setting.type === "toggle"}
          <Toggle
            text={setting.name}
            description={setting.description}
            size="small"
            checked={setting.state.state.toggle}
            update={async (toggled) => {
              setting.state.set({ toggle: toggled });
            }}
            {id} />
        {:else if setting.type === "slider"}
          <Slider
            {id}
            update={(newValue) => {
              setting.state.update({ value: newValue });
            }}
            {...setting.state.state} />
        {/if}
      {/each}
    {/if}
  </Modal>
{/if}
