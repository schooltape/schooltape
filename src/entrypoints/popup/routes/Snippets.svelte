<script lang="ts">
  import Title from "../components/Title.svelte";
  import Toggle from "../components/inputs/Toggle.svelte";
  import { SquarePen } from "@lucide/svelte";
  import Button from "../components/inputs/Button.svelte";
  import { navigate } from "../router";
  import { quickCSS, snippets } from "@/utils/storage";
</script>

<div id="card">
  <Title title="Snippets" bind:checked={snippets.state.toggle} />

  <div class="my-4 flex w-full flex-col gap-4">
    <Toggle
      id="quick-css"
      description="Make local CSS changes."
      bind:checked={quickCSS.state.toggle}
      text="Quick CSS"
      size="small">
      <Button onclick={() => navigate("/snippets/quick")} title="Edit Quick CSS" id="edit-quick-css"
        ><SquarePen size={20} /></Button>
    </Toggle>

    <!--
    {#each snippetInstances as snippet (snippet.meta.id)}
      <Toggle
        id={snippet.meta.id}
        bind:checked={snippet.toggle.state.toggle}
        text={snippet.meta.name}
        description={snippet.meta.description}
        size="small" />
    {/each}
    -->
  </div>
</div>
