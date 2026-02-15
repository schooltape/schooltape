<script lang="ts">
  import type { Snippet } from "svelte";
  import { isActive } from "../router";
  import { slide } from "svelte/transition";

  type Props = {
    href: "/" | "/plugins" | "/themes" | "/snippets" | "/account";
    title: string;
    children: Snippet;
    collapse?: boolean;
  };

  let { href, title, children, collapse = true }: Props = $props();
  let isHovered = $state(false);
</script>

<a
  onmouseenter={() => (isHovered = true)}
  onmouseleave={() => (isHovered = false)}
  href="#{href}"
  class="{isActive(href)
    ? 'bg-(--ctp-accent)/30'
    : 'hover:bg-(--ctp-accent)/10'} flex items-center p-2 transition-colors duration-300">
  {@render children()}

  {#if isHovered || (!collapse && isActive(href))}
    <span class="flex w-18 justify-center text-sm whitespace-nowrap" transition:slide={{ axis: "x" }}>{title}</span>
  {/if}
</a>
