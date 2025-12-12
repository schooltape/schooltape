<script lang="ts">
  import Toggle from "@/entrypoints/popup/components/inputs/Toggle.svelte";
  import Slider from "@/entrypoints/popup/components/inputs/Slider.svelte";
  import type { Settings } from ".";

  let { settings }: { settings: Settings } = $props();
</script>

<Toggle
  text="Reset on mouse move"
  description="Whether to reset the scrolling cooldown when you move your mouse."
  size="small"
  id="resetCooldownOnMouseMove"
  checked={settings.resetCooldownOnMouseMove.state.toggle}
  update={async (toggle) => {
    settings.resetCooldownOnMouseMove.set({ toggle });
  }} />

<Slider
  name="Cooldown duration"
  id="cooldownDuration"
  update={(value) => settings.cooldownDuration.update({ value })}
  {...settings.cooldownDuration.state} />
