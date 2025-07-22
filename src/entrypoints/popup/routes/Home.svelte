<script lang="ts">
  import Footer from "../components/Footer.svelte";
  import Motd from "../components/Motd.svelte";
  import { globalSettings } from "#imports";
</script>

<div id="card" class="flex flex-col gap-4">
  <h1>Schooltape</h1>

  <Motd />

  <button
    class={globalSettings.state.global
      ? "bg-ctp-green hover:bg-(--ctp-accent) active:bg-ctp-red/75"
      : "bg-ctp-red hover:bg-(--ctp-accent) active:bg-ctp-green/75"}
    id="toggle"
    onclick={() => {
      globalSettings.set({ global: !globalSettings.get().global });
    }}
    >{globalSettings.state.global ? "enabled" : "disabled"}
  </button>
</div>

<Footer />
