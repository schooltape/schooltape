<script lang="ts">
  import { global } from "@/utils/storage";
  import Footer from "../components/Footer.svelte";
  import Motd from "../components/Motd.svelte";

  let isJune = new Date().getMonth() === 5;
</script>

<div id="card" class="flex flex-col gap-4">
  <h1 class={isJune ? "ctp" : ""}>Schooltape</h1>

  <Motd />

  <button
    class="bg-(--ctp-accent) hover:opacity-75 {global.state ? '' : 'opacity-60'}"
    id="toggle"
    onclick={async () => {
      global.state = !global.state;
    }}
    >{global.state ? "enabled" : "disabled"}
  </button>
</div>

<Footer />
