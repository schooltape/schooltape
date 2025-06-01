<script lang="ts">
  import Title from "../components/Title.svelte";
  import { globalSettings } from "#imports";
  import IconBtn from "../components/inputs/IconBtn.svelte";
  import { Settings } from "lucide-svelte";
  import Modal from "../components/Modal.svelte";
  import ToggleComponent from "../components/inputs/Toggle.svelte";
  import Slider from "../components/inputs/Slider.svelte";

  let showModal = $state(false);
  let selectedPluginId: PluginId | undefined = $state();
  let selectedPlugin: StorageState<globalThis.PluginGeneric, globalThis.PluginInfo> | undefined = $derived.by(() => {
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
      <div class="my-4 group">
        <ToggleComponent
          {id}
          checked={plugin.state.toggle}
          update={(toggled: boolean) => {
            plugin.set({ toggle: toggled });
          }}
          text={plugin.info?.name}
          description={plugin.info?.description}
          size="small">
          {#if plugin.state.settings}
            <IconBtn
              title="Wiki"
              id="wiki"
              onclick={() => {
                selectedPluginId = id as PluginId;
                showModal = true;
              }}><Settings /></IconBtn>
          {/if}
        </ToggleComponent>
      </div>
    {/each}
  </div>
</div>

{#if selectedPlugin}
  <Modal bind:showModal>
    {#snippet header()}
      <h2 class="mb-4 text-xl">{selectedPlugin.info?.name}</h2>
    {/snippet}
    {#if selectedPlugin.state.settings?.toggle}
      {#each Object.entries(selectedPlugin.state.settings.toggle) as [id, setting] (id)}
        <ToggleComponent
          text={setting.name}
          description={setting.description}
          size="small"
          checked={setting.toggle}
          update={async () => {
            const settings = await selectedPlugin.storage.getValue();
            if (!settings.settings?.toggle) return;
            settings.settings.toggle[id].toggle = !settings.settings.toggle[id].toggle;
            await selectedPlugin.storage.setValue(settings);
          }}
          {id} />
      {/each}
    {/if}

    {#if selectedPlugin.state.settings?.slider}
      {#each Object.entries(selectedPlugin.state.settings.slider) as [id, setting] (id)}
        <Slider
          {id}
          update={async (newValue) => {
            const settings = await selectedPlugin.storage.getValue();
            if (!settings.settings?.slider) return;
            settings.settings.slider[id].value = newValue;
            await selectedPlugin.storage.setValue(settings);
          }}
          {...setting} />
      {/each}
    {/if}
  </Modal>
{/if}
