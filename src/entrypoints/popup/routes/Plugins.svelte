<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";

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
        <label class="slider-label group">
          <h4 class="text-ctp-text">{plugin.name}</h4>
          <input
            bind:checked={plugin.toggle}
            type="checkbox"
            class="peer slider-input"
            on:change={() => togglePlugin(plugin.id, plugin.toggle)} />
          <span class="slider small"></span>
        </label>
        <div class="slider-description">
          {plugin.description}
        </div>
      </div>
    {/each}
  </div>
</div>
