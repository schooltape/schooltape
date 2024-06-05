<script>
  import Footer from "../components/Footer.svelte";
  import browser from "webextension-polyfill";
  import { onMount } from "svelte";

  let settings = {
    global: false,
    updates: {
      toast: false,
      desktop: false,
    },
  };
  let updates = Object.keys(settings.updates);

  onMount(async () => {
    const storage = await browser.storage.local.get();
    console.log(storage);
    settings = storage.settings;
  });

  async function toggleUpdate() {
    await browser.storage.local.set({ settings: settings });
  }

  async function globalToggle() {
    settings.global = !settings.global;
    await browser.storage.local.set({ settings: settings });
    browser.runtime.sendMessage({ badgeText: true });
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

    {#each updates as update (update)}
      <label class="group relative mt-2 flex items-center justify-between p-2 text-lg text-ctp-text">
        <h4>{update}</h4>
        <input
          bind:checked={settings.updates[update]}
          on:change={() => toggleUpdate()}
          type="checkbox"
          class="peer absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md" />
        <span class="slider small"></span>
      </label>
    {/each}
  </details>
</div>

<Footer />
