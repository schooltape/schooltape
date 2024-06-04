<script>
  import Footer from "../components/Footer.svelte";
  import browser from "webextension-polyfill";
  import { onMount } from "svelte";

  let settings;
  let btnText;
  let btnClass;
  let updateToggle;

  onMount(async () => {
    const storage = await browser.storage.local.get();
    console.log("storage", storage);
    settings = storage.settings;
    updateToggle = storage.settings.updates.toggle;
    console.log("settings", settings);
    updateButton();
  });

  function updateButton() {
    if (settings.global) {
      btnClass = "bg-ctp-green hover:bg-ctp-pink active:bg-ctp-red/75";
      btnText = "enabled";
    } else {
      btnClass = "bg-ctp-red hover:bg-ctp-pink active:bg-ctp-green/75";
      btnText = "disabled";
    }
  }

  async function toggle() {
    settings.global = !settings.global;
    await browser.storage.local.set({ settings });
    browser.runtime.sendMessage({ badgeText: true });
    updateButton();
  }

  async function toggleUpdates() {
    const result = await browser.storage.local.get("settings");
    let newSettings = result.settings;
    newSettings.updates.toggle = !newSettings.updates.toggle;
    await browser.storage.local.set({ settings: newSettings });
    updateToggle = newSettings.updates.toggle;
  }
</script>

<div id="card">
  <h1 class="mb-6">Schooltape</h1>

  <button class={btnClass} id="toggle" on:click={toggle}>{btnText}</button>
  <details class="mt-10">
    <summary>Update Notifications</summary>

    <label class="group relative mt-6 flex items-center justify-between p-2 text-lg text-ctp-text">
      <h4>Desktop</h4>
      <input
        bind:checked={updateToggle}
        on:change={toggleUpdates}
        type="checkbox"
        class="peer absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md" />
      <!-- slider -->
      <span class="slider big"></span>
    </label>
  </details>
</div>

<Footer />
