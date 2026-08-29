<script lang="ts">
  import { House, Palette, Plug } from "@lucide/svelte";
  import NavButton from "../components/NavButton.svelte";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="w-full p-6">
  <nav class="text-ctp-text mb-4 flex w-full justify-between rounded-xl px-4 py-2" id="navbar">
    <div class="flex justify-center overflow-clip rounded-xl bg-ctp-surface0 outline-1 outline-ctp-overlay2/20 outline-solid">
      <NavButton href="/" title="Home"><House size={22} /></NavButton>
      <NavButton href="/plugins" title="Plugins"><Plug size={22} /></NavButton>
      <NavButton href="/themes" title="Themes"><Palette size={22} /></NavButton>
    </div>
  </nav>

  {@render children()}
</div>
