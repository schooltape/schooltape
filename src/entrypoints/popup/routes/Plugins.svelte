<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";
  import Slider from "../components/inputs/Slider.svelte";

  let populatedPlugins: PopulatedPlugin[] = [];

  // populate plugins
  async function getItem<T extends StPlugin>(pluginId: string): Promise<T | null> {
    logger.info(`Getting: local:plugin-${pluginId}`);
    const item = await storage.getItem<T>(`local:plugin-${pluginId}`);
    return item;
  }
  onMount(async () => {
    for (const pluginId of Object.keys(PLUGIN_INFO) as PluginId[]) {
      const item = await getItem<StPlugin>(pluginId);
      if (item) {
        console.log(`Plugin ID: ${item.id}, Plugin Toggle: ${item.toggle}`);
        // populatedPlugins.push(populatePlugin(item, PLUGIN_INFO[pluginId]));
      } else {
        logger.warn(`StPlugin ${pluginId} not found in storage`);
      }
    }
    // plugins = await pluginSettings.getValue();
    // populatedPlugins = populateItems(plugins.plugins, PLUGIN_INFO, "plugin");
    // console.log(populatedPlugins);
    // console.log("plugins", plugins);
  });

  function populatePlugin(plugin: StPlugin, pluginInfo: PluginInfo): PopulatedPlugin {
    return {
      ...plugin,
      ...pluginInfo,
    };
  }
  async function togglePlugin<T extends StPlugin>(pluginId: PluginId, toggled: boolean): Promise<void> {
    let item = (await storage.getItem(`local:plugin-${pluginId}`)) as T;
    if (item) {
      item.toggle = toggled;
      await storage.setItem(`local:plugin-${pluginId}`, item);
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
