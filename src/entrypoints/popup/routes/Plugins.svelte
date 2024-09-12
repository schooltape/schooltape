<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";
  import Slider from "../components/inputs/Slider.svelte";

  let plugins = pluginSettings.defaultValue;
  let populatedPlugins: PopulatedPlugin[] = populateItems(plugins.plugins, PLUGIN_INFO, "plugin");
  console.log(populatedPlugins);

  onMount(async () => {
    plugins = await pluginSettings.getValue();
    populatedPlugins = populateItems(plugins.plugins, PLUGIN_INFO, "plugin");
    console.log(populatedPlugins);
    console.log("plugins", plugins);
  });

  async function togglePlugin(pluginId: string, toggled: boolean): Promise<void> {
    plugins.plugins[pluginId].toggle = toggled;
    await pluginSettings.setValue(plugins);
    console.log(await pluginSettings.getValue());
  }
</script>

<div id="card">
  <Title title="Plugins" data={plugins} key="plugins" />

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
