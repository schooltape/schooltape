<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";
  import Slider from "../components/inputs/Slider.svelte";

  interface PopulatedPlugin extends PluginGeneric, PluginInfo {
    id: PluginId;
  }

  let populatedPlugins: PopulatedPlugin[] = [];
  let pluginsToggle: boolean = true;

  onMount(async () => {
    populatedPlugins = await populatePlugins();
    pluginsToggle = await globalSettings.getValue().then((settings) => settings.plugins);
  });

  async function handleToggleChange(event: CustomEvent) {
    let settings = await globalSettings.getValue();
    settings.plugins = event.detail.checked;
    await globalSettings.setValue(settings);
  }

  async function populatePlugins(): Promise<PopulatedPlugin[]> {
    const populatedPlugins: PopulatedPlugin[] = [];

    for (const pluginId of Object.keys(plugins) as PluginId[]) {
      const plugin = plugins[pluginId].fallback;
      const pluginInfo = PLUGIN_INFO[pluginId];

      const populatedPlugin: PopulatedPlugin = {
        id: pluginId,
        ...plugin,
        ...pluginInfo,
        toggle: false,
      };

      const item = await plugins[pluginId].getValue();
      populatedPlugin.toggle = item.toggle;

      populatedPlugins.push(populatedPlugin);
    }

    return populatedPlugins;
  }

  async function togglePlugin(pluginId: PluginId, toggled: boolean): Promise<void> {
    let item = await plugins[pluginId].getValue();
    if (item) {
      item.toggle = toggled;
      await plugins[pluginId].setValue(item);
      logger.info(`Toggled ${pluginId} to ${toggled}`);
    } else {
      logger.error(`Failed to toggle ${pluginId}, not found in storage`);
    }
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
