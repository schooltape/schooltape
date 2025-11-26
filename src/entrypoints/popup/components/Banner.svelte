<script lang="ts">
  let { children, message, onclick, visible = false } = $props();
</script>

{#if visible}
  <button
    class="banner mb-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-ctp-blue p-4 text-ctp-crust"
    {onclick}>
    {@render children()}
    <p>{message}</p>
  </button>
{/if}
