<script>
  import { onMount } from "svelte";
  import { MessageCircleQuestion, BugPlay, RotateCcw } from "lucide-svelte";

  let verNum;
  onMount(async () => {
    verNum = "v" + browser.runtime.getManifest().version;
  });

  function handleSupportClick() {
    window.open("https://github.com/42willow/schooltape/", "_blank");
  }

  function handleResetClick() {
    if (confirm("Are you sure you want to reset all settings?")) {
      browser.runtime.sendMessage({ resetSettings: true });
      location.reload();
    }
  }

  function handleBugClick() {
    window.open(browser.runtime.getURL("popup.html"), "_blank");
  }
</script>

<footer class="flex min-w-full justify-around p-4 mt-4">
  <p class="mb-0 flex items-center text-ctp-text">
    Version:
    <a
      class="version ml-2 text-ctp-blue hover:underline"
      target="_blank"
      href="https://github.com/42Willow/schooltape/releases/tag/${verNum}">{verNum}</a>
  </p>
  <div class="flex">
    <button title="Support" id="support" class="mx-2 small hover:bg-ctp-pink hover:text-ctp-crust" on:click={handleSupportClick}>
      <MessageCircleQuestion />
    </button>
    <button title="Reset" id="reset" class="mx-2 small hover:bg-ctp-red hover:text-ctp-crust" on:click={handleResetClick}>
      <RotateCcw />
    </button>
    <button title="Debug" id="support" class="mx-2 small hover:bg-ctp-blue hover:text-ctp-crust" on:click={handleBugClick}>
      <BugPlay />
    </button>
  </div>
</footer>
