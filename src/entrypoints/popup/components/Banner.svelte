<script lang="ts">
  import { run } from 'svelte/legacy';

  import { Info } from "lucide-svelte";
  import { writable } from "svelte/store";
  import { createEventDispatcher } from "svelte";

  interface Props {
    visible?: boolean; // Use a prop to control visibility
  }

  let { visible = false }: Props = $props();
  const bannerVisible = writable(visible);
  // Watch for changes in the prop and update the store
  run(() => {
    bannerVisible.set(visible);
  });

  const dispatch = createEventDispatcher();
  function handleClick() {
    dispatch("click");
  }
</script>

{#if $bannerVisible}
  <button
    class="banner bg-ctp-blue text-ctp-crust rounded-lg mb-4 flex items-center justify-center p-4 w-full"
    onclick={handleClick}>
    <Info class="w-8 mr-2" />
    <p>Click here to apply changes</p>
  </button>
{/if}
