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

<button {title} {id} class="small flex h-8 cursor-pointer items-center gap-3 bg-ctp-surface0 {classList}" {onclick}>
  {@render children()}
</button>
