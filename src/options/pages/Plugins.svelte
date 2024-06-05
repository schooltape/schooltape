<script>
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";

  let plugins = [];

  onMount(async () => {
    const response = await fetch("/plugins.json");
    const data = await response.json();
    const storage = await browser.storage.local.get(["plugins"]);
    console.log(storage.plugins.enabled);
    plugins = Object.entries(data).map(([pluginId, pluginData]) => {
      return {
        id: pluginId,
        name: pluginData.name,
        description: pluginData.description,
        toggled: storage.plugins.enabled.includes(pluginId),
      };
    });
  });

  async function togglePlugin(pluginId, toggled) {
    const storage = await browser.storage.local.get(["plugins"]);
    let plugins = storage.plugins;
    if (toggled) {
      plugins.enabled.push(pluginId);
    } else {
      plugins.enabled = plugins.enabled.filter((id) => id !== pluginId);
    }
    await browser.storage.local.set({ plugins });
  }
</script>

<div id="card">
  <h2>Plugins</h2>
  <div class="plugins-container">
    {#each plugins as plugin (plugin.id)}
      <div class="my-4 group">
        <label class="relative flex justify-between items-center group py-2 text-xl text-ctp-text">
          <h4 class="text-ctp-text">{plugin.name}</h4>
          <input
            plugin-id={plugin.id}
            bind:checked={plugin.toggled}
            type="checkbox"
            class="plugin-toggle absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md"
            on:change={() => togglePlugin(plugin.id, plugin.toggled)} />
          <!-- slider -->
          <span class="slider small"></span>
        </label>
        <!-- description -->
        <div class="text-ctp-overlay1 group-hover:text-ctp-subtext0 transition-colors duration-500 ease-in-out">
          {plugin.description}
        </div>
      </div>
    {/each}
  </div>
</div>
