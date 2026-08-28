<script lang="ts">
  import { globalSettings } from "@/utils/storage";
  import { snippets } from "@/entrypoints/snippets.content";

  import Title from "../components/Title.svelte";
  import Toggle from "../components/inputs/Toggle.svelte";
</script>

<div id="card">
  <Title title="Snippets" bind:checked={globalSettings.state.snippets} />

  <div class="snippets-container w-full">
    {#each snippets as snippet (snippet.meta.id)}
      <div class="group my-4 w-full">
        <Toggle
          id={snippet.meta.id}
          bind:checked={snippet.toggle.state.toggle}
          text={snippet.meta.name}
          description={snippet.meta.description}
          size="small" />
      </div>
    {/each}
  </div>
</div>
