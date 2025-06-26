<script lang="ts">
  let { visible = false, onclick } = $props();

  import { Info } from "@lucide/svelte";
</script>

{#if visible}
  <button
    class="banner bg-ctp-blue text-ctp-crust rounded-lg mb-4 flex items-center justify-center p-4 w-full"
    {onclick}>
    <Info class="w-8 mr-2" />
    <p>Click here to apply changes</p>
  </button>
{/if}
