<script lang="ts">
  import type { Snippet } from "svelte";
  import { isActive } from "../router";

  interface Props {
    href: "/" | "/plugins" | "/themes" | "/quickcss";
    title?: string;
    children: Snippet;
  }

  let { href, title, children }: Props = $props();
</script>

<a
  href="#{href}"
  class={[isActive(href)
    ? 'bg-(--ctp-accent)/30'
    : 'hover:bg-(--ctp-accent)/10',
     "flex items-center p-2 transition-colors duration-300 gap-1"
     ]}>
  {@render children()}

  <span class="flex justify-center text-xs whitespace-nowrap">{title}</span>
</a>
