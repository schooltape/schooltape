<script lang="ts">
  import { globalSettings } from "@/utils/storage";
  import Footer from "../components/Footer.svelte";
  import Motd from "../components/Motd.svelte";

  let isJune = new Date().getMonth() === 5;
</script>

<div id="card" class="flex flex-col gap-4">
  <h1 class={isJune ? "ctp" : ""}>Schooltape</h1>

  <Motd />

  <button
    class="bg-(--ctp-accent) hover:opacity-75 {globalSettings.state.global ? '' : 'opacity-60'}"
    id="toggle"
    onclick={async () => {
      globalSettings.state.global = !globalSettings.state.global;
    }}
    >{globalSettings.state.global ? "enabled" : "disabled"}
  </button>
</div>

<Footer />
