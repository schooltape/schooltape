<script lang="ts">
  import Footer from "../components/Footer.svelte";
  import { onMount } from "svelte";

  let settings = globalSettings.defaultValue;

  onMount(async () => {
    settings = await globalSettings.getValue();
    console.log("settings", settings);
  });

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
      ? "bg-ctp-green hover:bg-ctp-accent active:bg-ctp-red/75"
      : "bg-ctp-red hover:bg-ctp-accent active:bg-ctp-green/75"}
    id="toggle"
    on:click={globalToggle}
    >{settings.global ? "enabled" : "disabled"}
  </button>
</div>

<Footer />
