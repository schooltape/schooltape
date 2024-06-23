<script lang="ts">
  import Footer from "../components/Footer.svelte";
  import { onMount } from "svelte";

  let settings = globalSettings.defaultValue;
  let checkForUpdates = browser.runtime.sendMessage({ checkForUpdates: true });

  onMount(async () => {
    settings = await globalSettings.getValue();
    console.log("settings", settings);
  });

  async function toggleUpdate() {
    // console.log("settings", settings);
    await globalSettings.setValue(settings);
  }

  async function globalToggle() {
    settings.global = !settings.global;
    // console.log("settings", settings);
    await globalSettings.setValue(settings);
  }

  async function handleUpdateClick() {
    window.open("https://github.com/schooltape/schooltape/releases/latest", "_blank");
  }
</script>

<div id="card">
  <h1 class="mb-6">Schooltape</h1>

  <button
    class={settings.global
      ? "bg-ctp-green hover:bg-ctp-pink active:bg-ctp-red/75"
      : "bg-ctp-red hover:bg-ctp-pink active:bg-ctp-green/75"}
    id="toggle"
    on:click={globalToggle}
    >{settings.global ? "enabled" : "disabled"}
  </button>

  {#if settings.updates.available}
    <details class="mt-10 flex justify-center">
      <summary>Update Notifications</summary>

      <label class="group relative mt-2 flex items-center justify-between p-2 text-lg text-ctp-text">
        <h4>Desktop</h4>
        <input
          bind:checked={settings.updates.desktop}
          on:change={() => toggleUpdate()}
          type="checkbox"
          class="peer slider-input" />
        <span class="slider small"></span>
      </label>
      <label class="mt-2 flex justify-center">
        <button
          title="Check for updates"
          id="updates"
          class="small hover:bg-ctp-pink hover:text-ctp-crust"
          on:click={handleUpdateClick}>
          {#await checkForUpdates}
            Loading...
          {:then result}
            {result ? "Update available" : "Up to date!"}
          {:catch error}
            {error}
          {/await}
        </button>
      </label>
    </details>
  {/if}
</div>

<Footer />
