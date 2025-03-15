<script lang="ts">
  import { onMount } from "svelte";
  import IconBtn from "./inputs/IconBtn.svelte";
  import { MessageCircleMore, RotateCcw, BookText } from "lucide-svelte";

  let version: string = $state();
  let prefix: string;
  onMount(async () => {
    // Set version number
    // Uses manifest.version_name when available (on mv3)
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
  <p class="mb-0 flex items-center text-ctp-text">
    <a
      class="version ml-2 text-ctp-subtext0 hover:underline"
      target="_blank"
      href="https://github.com/schooltape/schooltape/releases/tag/v{version}">Version: v{version}</a>
  </p>
  <div class="flex">
    <IconBtn title="Wiki" id="wiki" onClick={handleWikiClick} icon={BookText} />
    <IconBtn title="Discord" id="discord" onClick={handleDiscordClick} icon={MessageCircleMore} />
    <IconBtn title="Reset" id="reset" onClick={handleResetClick} icon={RotateCcw} color="red" />
  </div>
</footer>
