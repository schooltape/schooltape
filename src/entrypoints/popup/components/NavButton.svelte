<script lang="ts">
  import type { Snippet } from "svelte";
  import { isActive } from "../router";
  import { slide } from "svelte/transition";

  interface Props {
    href: "/" | "/plugins" | "/themes" | "/snippets" | "/account";
    title?: string;
    children: Snippet;
    expand?: boolean;
  }

  let { href, title, children, expand = false }: Props = $props();
  let isHovered = $state(false);
</script>

<a
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => (isHovered = false)}
  href="#{href}"
  class="{(isActive.startsWith(href) && href !== '/') || isActive(href)
    ? 'bg-(--ctp-accent)/30'
    : 'hover:bg-(--ctp-accent)/10'} flex items-center p-2 transition-colors duration-300">
  {@render children()}

  {#if expand && (isHovered || isActive.startsWith(href))}
    <span class="flex w-18 justify-center text-sm whitespace-nowrap" transition:slide={{ axis: "x" }}>{title}</span>
  {/if}
</a>
