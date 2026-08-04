<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "#imports";
  import { updated } from "@/utils/storage";
  import Button from "./inputs/Button.svelte";
  import { RotateCcw, Globe, GitBranch } from "@lucide/svelte";
  import { sendMessage } from "@/utils";

  let version = $state();

  onMount(() => {
    // set version number
    // uses manifest.version_name when available (on mv3)
    let manifest = browser.runtime.getManifest();
    version = manifest.version_name || manifest.version;
  });
</script>

<footer class="mt-4 flex min-w-full justify-around p-4">
  <span class="relative inline-flex">
    <Button
      onclick={() => {
        updated.state.changelog = false;

        browser.tabs.create({
          url: `https://github.com/schooltape/schooltape/releases/tag/v${version}`,
        });
      }}
      title="Open changelog"
      id="changelog"
      classList="text-ctp-subtext0 hover:bg-ctp-surface1">
      <GitBranch size={18} /> v{version}
      <!-- show ripple badge if the extension has been updated (unread release notes) -->
      {#if updated.state.changelog}
        <span class="absolute top-0 right-0 -mt-1 -mr-1 flex size-3">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-ctp-blue opacity-75"></span>
          <span class="relative inline-flex size-3 rounded-full bg-ctp-blue"></span>
        </span>
      {/if}
    </Button>
  </span>
  <div class="flex gap-3">
    <Button
      title="Website"
      id="website"
      onclick={() => {
        window.open("https://schooltape.github.io", "_blank");
      }}><Globe size={22} /></Button>

    <Button
      title="Reset"
      id="reset"
      classList="text-ctp-text hover:text-ctp-base hover:bg-ctp-red"
      onclick={() => {
        if (confirm("Are you sure you want to reset all settings?")) {
          sendMessage({ type: "resetSettings" });
          location.reload();
        }
      }}><RotateCcw size={22} /></Button>
  </div>
</footer>
