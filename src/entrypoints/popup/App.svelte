<script lang="ts">
  import { onMount } from "#imports";
  import { sendMessage } from "@/utils";
  import { themes, updated } from "@/utils/storage";
  import { flavors } from "@catppuccin/palette";
  import { Router } from "sv-router"
  import "./router.ts";

  function getAccentRgb(accent: string, flavour: string) {
    let x = (flavors as any)[flavour].colors[accent].rgb;
    return `rgb(${x.r}, ${x.g}, ${x.b})`;
  }

  let accentRgb = $derived(getAccentRgb(themes.state.accent, themes.state.flavour));

  onMount(async () => {
    await updated.update({ icon: false });
    sendMessage({ type: "updateIcon" });
  });
</script>

<main
  class="flex flex-col items-center bg-ctp-base p-6 {themes.state.flavour}"
  style="--ctp-accent: {accentRgb}">
  <Router base="#" />
</main>

