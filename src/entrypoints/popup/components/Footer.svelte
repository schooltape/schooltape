<script>
  import { onMount } from "svelte";
  import { MessageCircleMore, RotateCcw, BookText } from "lucide-svelte";

  let version;
  let prefix;
  onMount(async () => {
    // Set version number
    // Uses manifest.version_name when available (on mv3)
    let manifest = browser.runtime.getManifest();
    version = manifest.version_name || manifest.version;
    prefix = version.length <= 5 ? "Version: v" : "v";
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
      href="https://github.com/schooltape/schooltape/releases/tag/v{version}">{prefix}{version}</a>
  </p>
  <div class="flex">
    <button
      title="Wiki"
      id="wiki"
      class="mx-2 small hover:bg-ctp-accent hover:text-ctp-crust"
      on:click={handleWikiClick}>
      <BookText />
    </button>
    <button
      title="Discord"
      id="discord"
      class="mx-2 small hover:bg-ctp-accent hover:text-ctp-crust"
      on:click={handleDiscordClick}>
      <MessageCircleMore />
    </button>
    <button
      title="Reset"
      id="reset"
      class="mx-2 small hover:bg-ctp-red hover:text-ctp-crust"
      on:click={handleResetClick}>
      <RotateCcw />
    </button>
  </div>
</footer>
