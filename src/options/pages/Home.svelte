<script>
  import Footer from "../components/Footer.svelte";
  import browser from "webextension-polyfill";
  import { onMount } from "svelte";
  import Toggle from '../components/Toggle.svelte';

  let settings;
  let btnText;
  let btnClass;
  let updateToggle = {
    toast: false,
    desktop: false,
  };

  onMount(async () => {
    const storage = await browser.storage.local.get();
    console.log("storage", storage);
    settings = storage.settings;
    updateToggle = settings.updates;
    updateButton();
  });

  async function toggleUpdate() {
    const storage = await browser.storage.local.get("settings");
    let newSettings = storage.settings;
    newSettings.updates = updateToggle;
    await browser.storage.local.set({ settings: newSettings });
  }

  function updateButton() {
    if (settings.global) {
      btnClass = "bg-ctp-green hover:bg-ctp-pink active:bg-ctp-red/75";
      btnText = "enabled";
    } else {
      btnClass = "bg-ctp-red hover:bg-ctp-pink active:bg-ctp-green/75";
      btnText = "disabled";
    }
  }

  async function globalToggle() {
    settings.global = !settings.global;
    await browser.storage.local.set({ settings });
    browser.runtime.sendMessage({ badgeText: true });
    updateButton();
  }
</script>

<div id="card">
  <h1 class="mb-6">Schooltape</h1>

  <button class={btnClass} id="toggle" on:click={globalToggle}>{btnText}</button>
  <details class="mt-10">
    <summary>Update Notifications</summary>

    <label class="group relative mt-2 flex items-center justify-between p-2 text-lg text-ctp-text">
      <h4>Toast</h4>
      <input
        bind:checked={updateToggle.toast}
        on:change={() => toggleUpdate("toast")}
        type="checkbox"
        class="peer absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md" />
      <span class="slider small"></span>
    </label>

    <label class="group relative mt-2 flex items-center justify-between p-2 text-lg text-ctp-text">
      <h4>Desktop</h4>
      <input
        bind:checked={updateToggle.desktop}
        on:change={() => toggleUpdate("desktop")}
        type="checkbox"
        class="peer absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md" />
      <span class="slider small"></span>
    </label>
  </details>
</div>

<Footer />
