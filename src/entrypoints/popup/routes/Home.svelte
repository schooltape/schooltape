<script lang="ts">
  import Footer from "../components/Footer.svelte";
  import Motd from "../components/Motd.svelte";
  import { globalSettings } from "#imports";

  let isJune = new Date().getMonth() === 5;
</script>

<div id="card" class="flex flex-col gap-4">
  <h1 class={isJune ? "ctp" : ""}>Schooltape</h1>

  <Motd />

  <button
    class="hover:opacity-75 bg-(--ctp-accent) {globalSettings.state.global ? '' : 'opacity-60'}"
    id="toggle"
    onclick={() => {
      globalSettings.set({ global: !globalSettings.get().global });
    }}
    >{globalSettings.state.global ? "enabled" : "disabled"}
  </button>
</div>

<Footer />
