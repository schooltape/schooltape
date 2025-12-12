<script lang="ts">
  import Toggle from "@/entrypoints/popup/components/inputs/Toggle.svelte";
  import type { Settings } from ".";

  let { settings }: { settings: Settings } = $props();
</script>

<Toggle
  text="Open links in new tab"
  description="Whether to open class links in a new tab."
  size="small"
  id="openInNewTab"
  checked={settings.openInNewTab.state.toggle}
  update={async (toggle) => {
    settings.openInNewTab.set({ toggle });
  }} />
