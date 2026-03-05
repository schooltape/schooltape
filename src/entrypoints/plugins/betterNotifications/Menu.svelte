<script lang="ts">
  import Toggle from "@/entrypoints/popup/components/inputs/Toggle.svelte";
  import type { Settings } from ".";

  let { settings }: { settings: Settings } = $props();
</script>

<Toggle
  text="Scrape Notifications"
  description="Enable notification scraping."
  size="small"
  id="scrapeNotifications"
  bind:checked={settings.scrapeNotifications.state.toggle} />
