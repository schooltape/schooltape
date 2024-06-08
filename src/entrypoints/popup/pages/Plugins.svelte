<script>
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";

  let plugins = {
    toggle: false,
    enabled: [],
  };

  let populatedPlugins = [];

  onMount(async () => {
    const response = await fetch("/plugins.json");
    const data = await response.json();
    const storage = await browser.storage.local.get();
    console.log("plugins", storage.plugins);
    plugins = storage.plugins;
    populatedPlugins = Object.entries(data).map(([pluginId, pluginData]) => {
      return {
        id: pluginId,
        name: pluginData.name,
        description: pluginData.description,
        toggled: storage.plugins.enabled.includes(pluginId),
      };
    });
  });

  async function togglePlugin(pluginId, toggled) {
    if (toggled) {
      plugins.enabled.push(pluginId);
    } else {
      plugins.enabled = plugins.enabled.filter((id) => id !== pluginId);
    }
    await browser.storage.local.set({ plugins: plugins });
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
            plugin-id={plugin.id}
            bind:checked={plugin.toggled}
            type="checkbox"
            class="peer slider-input"
            on:change={() => togglePlugin(plugin.id, plugin.toggled)} />
          <span class="slider small"></span>
        </label>
        <div class="slider-description">
          {plugin.description}
        </div>
      </div>
    {/each}
  </div>
</div>
