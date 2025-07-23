<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    title: string;
    id: string;
    onclick: () => void;
    label?: string;
    color?: string;
  }

  let { children, title, id, onclick, label = "" }: Props = $props();
</script>

<button
  {title}
  {id}
  class="flex items-center cursor-pointer ml-4 small hover:text-ctp-crust hover:bg-(--ctp-accent)"
  {onclick}>
  {@render children()}
  {#if label}
    <span class="ml-3">{label}</span>
  {/if}
</button>
