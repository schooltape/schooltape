<script lang="ts">
  let { children, message, onclick, visible = false } = $props();
</script>

{#if visible}
  <button
    class="banner cursor-pointer flex gap-2 items-center justify-center bg-ctp-blue text-ctp-crust rounded-lg mb-4 p-4 w-full"
    {onclick}>
    {@render children()}
    <p>{message}</p>
  </button>
{/if}
