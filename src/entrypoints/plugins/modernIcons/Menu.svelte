<script lang="ts">
  import Toggle from "@/entrypoints/popup/components/inputs/Toggle.svelte";
  import type { Settings } from ".";

  let { settings }: { settings: Settings } = $props();
</script>

<Toggle
  text="Filled icons"
  description="Whether the icons should be filled or outlined."
  size="small"
  id="filled"
  checked={settings.filled.state.toggle}
  update={async (toggle) => {
    settings.filled.set({ toggle });
  }} />
