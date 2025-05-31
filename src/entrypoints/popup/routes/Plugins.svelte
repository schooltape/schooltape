<script lang="ts">
  import Title from "../components/Title.svelte";
  import Slider from "../components/inputs/Slider.svelte";
  import { globalSettings } from "#imports";
</script>

<div id="card">
  <Title
    title="Plugins"
    checked={globalSettings.state.plugins}
    update={(toggled: boolean) => {
      globalSettings.set({ plugins: toggled });
    }} />

  <div class="plugins-container">
    {#each Object.entries(plugins) as [id, plugin] (id)}
      <div class="my-4 group">
        <Slider
          {id}
          checked={plugin.state.toggle}
          update={(toggled: boolean) => {
            plugin.set({ toggle: toggled });
          }}
          text={plugin.info?.name}
          description={plugin.info?.description}
          size="small" />
      </div>
    {/each}
  </div>
</div>
