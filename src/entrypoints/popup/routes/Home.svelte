<script lang="ts">
  import Footer from "../components/Footer.svelte";
  import { onMount } from "svelte";

  let settings = globalSettings.defaultValue;
  const updateKeys = ["toast", "desktop"];

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
  <details class="mt-10">
    <summary>Update Notifications</summary>

    {#each updateKeys as update (update)}
      <label class="group relative mt-2 flex items-center justify-between p-2 text-lg text-ctp-text">
        <h4>{update}</h4>
        <input
          bind:checked={settings.updates[update]}
          on:change={() => toggleUpdate()}
          type="checkbox"
          class="peer slider-input" />
        <span class="slider small"></span>
      </label>
    {/each}
  </details>
</div>

<Footer />
