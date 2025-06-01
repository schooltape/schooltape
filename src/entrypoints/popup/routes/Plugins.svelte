<script lang="ts">
  import Title from "../components/Title.svelte";
  import Slider from "../components/inputs/Slider.svelte";
</script>

<div id="card">
  <Title
    title="Plugins"
    bind:checked={globalSettings.state.plugins}
    on:change={(event: CustomEvent) => {
      globalSettings.set({ plugins: event.detail.checked });
    }} />

  <div class="plugins-container">
    {#each Object.entries(plugins) as [id, plugin] (id)}
      <div class="my-4 group">
        <Slider
          {id}
          bind:checked={plugin.state.toggle}
          on:change={(event: CustomEvent) => {
            plugin.set({ toggle: event.detail.checked });
          }}
          text={plugin.info?.name}
          description={plugin.info?.description}
          size="small" />
      </div>
    {/each}
  </div>
</div>
