<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";
  import Slider from "../components/inputs/Slider.svelte";

  let populatedPlugins: PopulatedItem<PluginId>[] = [];
  let pluginsToggle: boolean = true;

  onMount(async () => {
    populatedPlugins = await populateItems(plugins, PLUGIN_INFO);
    pluginsToggle = await globalSettings.getValue().then((settings) => settings.plugins);
  });

  async function handleToggleChange(event: CustomEvent) {
    let settings = await globalSettings.getValue();
    settings.plugins = event.detail.checked;
    await globalSettings.setValue(settings);
  }

  async function togglePlugin(pluginId: PluginId, toggled: boolean): Promise<void> {
    await toggleItem(plugins, pluginId, toggled);
  }
</script>

<div id="card">
  <Title title="Plugins" bind:checked={pluginsToggle} on:change={handleToggleChange} />

  <div class="plugins-container">
    {#each populatedPlugins as plugin}
      <div class="my-4 group">
        <Slider
          id={plugin.id}
          bind:checked={plugin.toggle}
          on:change={() => togglePlugin(plugin.id, plugin.toggle)}
          text={plugin.name}
          description={plugin.description}
          size="small" />
      </div>
    {/each}
  </div>
</div>
