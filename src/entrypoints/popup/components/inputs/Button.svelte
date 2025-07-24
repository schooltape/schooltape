<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    title: string;
    id: string;
    onclick: () => void;
    classList?: string;
  }

  let { children, title, id, onclick, classList = "text-ctp-text hover:bg-ctp-surface1" }: Props = $props();
</script>

<button {title} {id} class="flex gap-3 items-center cursor-pointer h-8 bg-ctp-surface0 small {classList}" {onclick}>
  {@render children()}
</button>
