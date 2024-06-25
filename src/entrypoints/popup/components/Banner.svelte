<script lang="ts">
  import { Info } from "lucide-svelte";
  import { writable } from "svelte/store";
  import { createEventDispatcher } from "svelte";

  export let visible = false; // Use a prop to control visibility
  const bannerVisible = writable(visible);
  // Watch for changes in the prop and update the store
  $: bannerVisible.set(visible);

  const dispatch = createEventDispatcher();
  function handleClick() {
    dispatch("click");
  }
</script>

{#if $bannerVisible}
  <button
    class="banner bg-ctp-blue text-ctp-crust rounded-lg mb-4 flex items-center justify-center p-4 w-full"
    on:click={handleClick}>
    <Info class="w-8 mr-2" />
    <p>Click here to apply changes</p>
  </button>
{/if}
