<script lang="ts">
  import "./router.ts";
  import { onMount } from "#imports";
  import { globalSettings, updated } from "@/utils/storage";
  import { sendMessage } from "@/utils";
  import { flavors } from "@catppuccin/palette";
  import { Router } from "sv-router";

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
  class="bg-ctp-base flex flex-col items-center {globalSettings.state.themeFlavour}"
  style="--ctp-accent: {accentRgb}">
  <Router base="#" />
</main>
