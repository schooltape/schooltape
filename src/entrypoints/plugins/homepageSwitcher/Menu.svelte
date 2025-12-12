<script lang="ts">
  import Toggle from "@/entrypoints/popup/components/inputs/Toggle.svelte";
  import type { Settings } from ".";

  let { settings }: { settings: Settings } = $props();
</script>

<Toggle
  text="Close current tab"
  description="When switching to another tab, close the current one."
  size="small"
  id="closeCurrentTab"
  checked={settings.closeCurrentTab.state.toggle}
  update={async (toggle) => {
    settings.closeCurrentTab.set({ toggle });
  }} />
