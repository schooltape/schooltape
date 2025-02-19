<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";
  import Slider from "../components/inputs/Slider.svelte";

  interface PopulatedPlugin extends PluginGeneric, PluginInfo {
    id: PluginId;
  }

  let populatedPlugins: PopulatedPlugin[] = populatePlugins();

  onMount(async () => {
    for (const plugin of populatedPlugins) {
      const item = await plugins[plugin.id].getValue();
      if (item) {
        console.log(`Got ${plugin.id}, set toggle to ${item.toggle}`);
        plugin.toggle = item.toggle;
      } else {
        logger.error(`Failed to get ${plugin.id}, not found in storage`);
      }
    }
    // trigger reactivity
    populatedPlugins = [...populatedPlugins];
  });

  function populatePlugin(pluginId: PluginId, plugin: PluginGeneric, pluginInfo: PluginInfo): PopulatedPlugin {
    return {
      id: pluginId,
      ...plugin,
      ...pluginInfo,
    };
  }
  function populatePlugins(): PopulatedPlugin[] {
    let populatedPlugins: PopulatedPlugin[] = [];

    for (const pluginId of Object.keys(plugins) as PluginId[]) {
      let plugin = plugins[pluginId].fallback;

      const pluginInfo = PLUGIN_INFO[pluginId];
      if (plugin && pluginInfo) {
        populatedPlugins.push(populatePlugin(pluginId, plugin, pluginInfo));
      } else {
        logger.error(`Plugin ${pluginId} not found in storage`);
      }
    }

    return populatedPlugins;
  }

  async function togglePlugin(pluginId: PluginId, toggled: boolean): Promise<void> {
    let item = await plugins[pluginId].getValue();
    if (item) {
      item.toggle = toggled;
      await plugins[pluginId].setValue(item);
      console.log(`Toggled ${pluginId} to ${toggled}`);
    } else {
      logger.error(`Failed to toggle ${pluginId}, not found in storage`);
    }
  }
</script>

<div id="card">
  <Title title="Plugins" />

  <div class="plugins-container">
    {#each populatedPlugins as plugin}
      <div class="my-4 group">
        <Slider
          id={plugin.id}
          bind:checked={plugin.toggle}
          onChange={() => togglePlugin(plugin.id, plugin.toggle)}
          text={plugin.name}
          description={plugin.description}
          size="small" />
      </div>
    {/each}
  </div>
</div>
