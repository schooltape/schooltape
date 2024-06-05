<script>
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";

  let verNum;
  onMount(async () => {
    verNum = "v" + browser.runtime.getManifest().version;

    const resetButton = document.getElementById("reset");
    if (resetButton) {
      resetButton.addEventListener("click", function () {
        if (confirm("Are you sure you want to reset all settings?")) {
          browser.runtime.sendMessage({ resetSettings: true });
          location.reload();
        }
      });
    }
  });
</script>

<footer class="mt-5 flex min-w-full justify-around p-4">
  <p class="mb-0 flex items-center text-ctp-text">
    Version:
    <a
      class="version ml-2 text-ctp-blue hover:underline"
      target="_blank"
      href="https://github.com/42Willow/schooltape/releases/tag/${verNum}">{verNum}</a>
  </p>
  <a target="_blank" href="https://github.com/42willow/schooltape/issues"
    ><button id="support" class="small bg-ctp-surface0 text-ctp-text hover:bg-ctp-pink hover:text-ctp-crust">Support</button
    ></a>
  <button id="reset" class="small bg-ctp-surface0 text-ctp-text hover:bg-ctp-red hover:text-ctp-crust">Reset</button>
</footer>
