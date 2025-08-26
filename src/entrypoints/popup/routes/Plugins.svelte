<script lang="ts">
  import Title from "../components/Title.svelte";
  import { globalSettings } from "#imports";
  import Button from "../components/inputs/Button.svelte";
  import { Settings } from "@lucide/svelte";
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
      globalSettings.set({ plugins: toggled });
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
          text={plugin.info.name}
          description={plugin.info.description}
          size="small">
          {#if plugin.settings !== undefined}
            <Button
              title={plugin.info.name + " Settings"}
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
      <h2 class="mb-4 text-xl">{selectedPlugin.info.name}</h2>
    {/snippet}
    <!-- toggles -->
    {#if selectedPlugin.settings?.toggle !== undefined}
      {#each Object.entries(selectedPlugin.settings.toggle) as [id, setting] (id)}
        <Toggle
          text={setting.info.name}
          description={setting.info.description}
          size="small"
          checked={setting.toggle.state.toggle}
          update={async (toggled) => {
            setting.toggle.set({ toggle: toggled });
          }}
          {id} />
      {/each}
    {/if}

    <!-- sliders -->
    {#if selectedPlugin.settings?.slider !== undefined}
      {#each Object.entries(selectedPlugin.settings.slider) as [id, setting] (id)}
        <Slider
          {id}
          update={async (newValue) => {
            setting.slider.set({ value: newValue });
          }}
          {...setting.slider.state} />
      {/each}
    {/if}
  </Modal>
{/if}
