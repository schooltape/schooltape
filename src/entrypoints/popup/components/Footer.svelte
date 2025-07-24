<script lang="ts">
  import { onMount } from "svelte";
  import Button from "./inputs/Button.svelte";
  import { RotateCcw, Globe, GitBranch } from "@lucide/svelte";

  let version = $state();

  onMount(() => {
    // set version number
    // uses manifest.version_name when available (on mv3)
    let manifest = browser.runtime.getManifest();
    version = manifest.version_name || manifest.version;
  });
</script>

<footer class="flex min-w-full justify-around p-4 mt-4">
  <span class="relative inline-flex">
    <Button
      onclick={async () => {
        await globalSettings.set({ updated: false });

        browser.tabs.create({
          url: `https://github.com/schooltape/schooltape/releases/tag/v${version}`,
        });
      }}
      title="Open changelog"
      id="changelog"
      classList="text-ctp-subtext0 hover:bg-ctp-surface1">
      <GitBranch size={18} /> v{version}
      <!-- show ripple badge if the extension has been updated (unread release notes) -->
      {#if globalSettings.state.updated}
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
      title="Discord"
      id="discord"
      onclick={() => {
        window.open("https://discord.gg/rZxtGJ98BE", "_blank");
      }}
      ><svg class="h-[22px] fill-ctp-text" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
        ><title>Discord</title><path
          d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg
      ></Button>

    <Button
      title="Reset"
      id="reset"
      classList="hover:text-ctp-base hover:bg-ctp-red"
      onclick={() => {
        if (confirm("Are you sure you want to reset all settings?")) {
          browser.runtime.sendMessage({ resetSettings: true });
          location.reload();
        }
      }}><RotateCcw size={22} /></Button>
  </div>
</footer>
