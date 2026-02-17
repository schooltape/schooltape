<script lang="ts">
  import "./router.ts";
  import { onMount } from "#imports";
  import { globalSettings, updated } from "@/utils/storage";
  import { sendMessage } from "@/utils";
  import { flavors } from "@catppuccin/palette";
  import { Router } from "sv-router";
  import { Braces, CircleUser, House, Palette, Plug } from "@lucide/svelte";
  import NavButton from "./components/NavButton.svelte";
  import NavButtonGroup from "./components/NavButtonGroup.svelte";

  function getAccentRgb(accent: string, flavour: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let x = (flavors as any)[flavour].colors[accent].rgb;
    return `rgb(${x.r}, ${x.g}, ${x.b})`;
  }

  let accentRgb = $derived(getAccentRgb(globalSettings.state.themeAccent, globalSettings.state.themeFlavour));

  onMount(() => {
    updated.update({ icon: false });
    sendMessage({ type: "updateIcon" });
  });
</script>

<main
  class="flex flex-col items-center bg-ctp-base p-6 {globalSettings.state.themeFlavour}"
  style="--ctp-accent: {accentRgb}">
  <nav class="mb-4 flex w-full justify-between rounded-xl px-4 py-2 text-ctp-text" id="navbar">
    <NavButtonGroup>
      <NavButton href="/" title="Home"><House size={22} /></NavButton>
      <NavButton href="/plugins" title="Plugins"><Plug size={22} /></NavButton>
      <NavButton href="/themes" title="Themes"><Palette size={22} /></NavButton>
      <NavButton href="/snippets" title="Snippets"><Braces size={22} /></NavButton>
    </NavButtonGroup>

    <NavButtonGroup>
      <NavButton href="/account" title="Account" expand={true}><CircleUser size={22} /></NavButton>
    </NavButtonGroup>
  </nav>

  <Router base="#" />
</main>
