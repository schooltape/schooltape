<script lang="ts">
  import Toggle from "@/entrypoints/popup/components/inputs/Toggle.svelte";
  import type { Settings } from ".";

  let { settings }: { settings: Settings } = $props();
</script>

<Toggle
  text="Show subject prefix"
  description="e.g. 'ENG - VCE English 1 & 2' becomes 'VCE English 1 & 2'"
  size="small"
  id="showSubjectPrefix"
  bind:checked={settings.showSubjectPrefix.state.toggle} />
