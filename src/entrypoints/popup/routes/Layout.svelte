<script lang="ts">
  import { CircleUser, House, PaintbrushVertical, Palette, Plug } from "@lucide/svelte";
  import NavButton from "../components/NavButton.svelte";
  import NavButtonGroup from "../components/NavButtonGroup.svelte";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="w-full p-6">
  <nav class="text-ctp-text mb-4 flex w-full justify-between rounded-xl px-4 py-2" id="navbar">
    <NavButtonGroup>
      <NavButton href="/" title="Home"><House size={22} /></NavButton>
      <NavButton href="/plugins" title="Plugins"><Plug size={22} /></NavButton>
      <NavButton href="/themes" title="Themes"><Palette size={22} /></NavButton>
      <NavButton href="/snippets" title="Snippets"><PaintbrushVertical size={22} /></NavButton>
    </NavButtonGroup>

    <NavButtonGroup>
      <NavButton href="/account" title="Account" expand={true}><CircleUser size={22} /></NavButton>
    </NavButtonGroup>
  </nav>

  {@render children()}
</div>
