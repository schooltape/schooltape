<script lang="ts">
  interface Props {
    title: any;
    id: any;
    onClick: any;
    icon: any;
    label?: string;
    color?: string;
  }

  let { title, id, onClick, icon, label = "" }: Props = $props();
</script>

<button
  {title}
  {id}
  class="flex items-center mx-2 small hover:text-ctp-crust hover:bg-(--ctp-accent)"
  onclick={onClick}>
  {#if icon}
    {@const SvelteComponent = icon}
    <SvelteComponent />
  {/if}
  {#if label}
    <span class="ml-3">{label}</span>
  {/if}
</button>
