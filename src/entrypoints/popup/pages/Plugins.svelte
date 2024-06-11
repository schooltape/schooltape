<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";

  let plugins = pluginSettings.defaultValue;

  let populatedPlugins: PopulatedPluginV1[];

  onMount(async () => {
    const response = await fetch("/plugins.json");
    const data = await response.json();
    plugins = await pluginSettings.getValue();
    console.log("plugins", plugins);
    populatedPlugins = Object.entries(data as Record<string, PluginData>).map(([pluginId, pluginData]) => {
      return {
        id: pluginId,
        name: pluginData.name,
        description: pluginData.description,
        toggle: plugins.enabled.includes(pluginId),
      };
    });
  });

  async function togglePlugin(pluginId: string, toggled: boolean): Promise<void> {
    if (toggled) {
      plugins.enabled.push(pluginId);
    } else {
      plugins.enabled = plugins.enabled.filter((id: string) => id !== pluginId);
    }
    await pluginSettings.setValue(plugins);
  }
</script>

<div id="card">
  <Title title="Plugins" data={plugins} key="plugins" />

  <div class="plugins-container">
    {#each populatedPlugins as plugin (plugin.id)}
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
