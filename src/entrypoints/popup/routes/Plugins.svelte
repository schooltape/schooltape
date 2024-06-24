<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";

  let plugins = pluginSettings.defaultValue;

  onMount(async () => {
    plugins = await pluginSettings.getValue();
    console.log("plugins", plugins);
  });

  async function togglePlugin(pluginId: string, toggled: boolean): Promise<void> {
    plugins.plugins[pluginId].toggle = toggled;
    await pluginSettings.setValue(plugins);
    console.log(await pluginSettings.getValue())
  }
</script>

<div id="card">
  <Title title="Plugins" data={plugins} key="plugins" />

  <div class="plugins-container">
    {#each plugins.pluginOrder as id}
      <div class="my-4 group">
        <label class="slider-label group">
          <h4 class="text-ctp-text">{plugins.plugins[id].name}</h4>
          <input
            bind:checked={plugins.plugins[id].toggle}
            type="checkbox"
            class="peer slider-input"
            on:change={() => togglePlugin(id, plugins.plugins[id].toggle)} />
          <span class="slider small"></span>
        </label>
        <div class="slider-description">
          {plugins.plugins[id].description}
        </div>
      </div>
    {/each}
  </div>
</div>
