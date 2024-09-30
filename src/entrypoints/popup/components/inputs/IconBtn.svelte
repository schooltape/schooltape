<script lang="ts">
  export let title;
  export let id;
  export let onClick;
  export let icon;
  export let label = '';
  export let color = 'accent';
</script>

<button
  title={title}
  id={id}
  class="flex items-center mx-2 small hover:text-ctp-crust hover:bg-ctp-{color}"
  on:click={onClick}>
  {#if icon}
    <svelte:component this={icon} />
  {/if}
  {#if label}
    <span class="ml-3">{label}</span>
  {/if}
</button>
