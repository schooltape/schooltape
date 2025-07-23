<script lang="ts">
  import { onMount } from "svelte";
  import IconBtn from "./inputs/IconBtn.svelte";
  import { MessageCircleMore, RotateCcw, BookText, GitBranch } from "@lucide/svelte";

  let version = $state();

  onMount(() => {
    // set version number
    // uses manifest.version_name when available (on mv3)
    let manifest = browser.runtime.getManifest();
    version = manifest.version_name || manifest.version;
  });

  function handleDiscordClick() {
    window.open("https://discord.gg/rZxtGJ98BE", "_blank");
  }

  function handleResetClick() {
    if (confirm("Are you sure you want to reset all settings?")) {
      browser.runtime.sendMessage({ resetSettings: true });
      location.reload();
    }
  }

  function handleWikiClick() {
    window.open("https://schooltape.github.io", "_blank");
  }
</script>

<footer class="flex min-w-full justify-around p-4 mt-4">
  <span class="relative inline-flex">
    <button
      onclick={async () => {
        await globalSettings.set({ updated: false });

        browser.tabs.create({
          url: `https://github.com/schooltape/schooltape/releases/tag/v${version}`,
        });
      }}
      class="rounded-lg px-2 text-ctp-subtext0 hover:bg-ctp-surface1">
      <span class="flex gap-2 items-center"><GitBranch size={18} />v{version}</span>
      <!-- show ripple badge if the extension has been updated (unread release notes) -->
      {#if globalSettings.state.updated}
        <span class="absolute top-0 right-0 -mt-1 -mr-1 flex size-3">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-ctp-blue opacity-75"></span>
          <span class="relative inline-flex size-3 rounded-full bg-ctp-blue"></span>
        </span>
      {/if}
    </button>
  </span>
  <div class="flex">
    <IconBtn title="Wiki" id="wiki" onclick={handleWikiClick}><BookText /></IconBtn>
    <IconBtn title="Discord" id="discord" onclick={handleDiscordClick}><MessageCircleMore /></IconBtn>
    <IconBtn title="Reset" id="reset" onclick={handleResetClick} color="red"><RotateCcw /></IconBtn>
  </div>
</footer>
