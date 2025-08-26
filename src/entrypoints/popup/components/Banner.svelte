<script lang="ts">
  let { children, message, onclick, visible = false } = $props();
</script>

{#if visible}
  <button
    class="banner bg-ctp-blue text-ctp-crust mb-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg p-4"
    {onclick}>
    {@render children()}
    <p>{message}</p>
  </button>
{/if}
