<script lang="ts">
  import { motd } from "@/utils/storage";
  import { onMount } from "svelte";

  onMount(async () => {
    // update MOTD
    const response = await fetch("https://schooltape.github.io/motd.txt");
    if (response.ok) {
      motd.state.motd = await response.text();
    }
  });
</script>

<!-- MOTD -->
<div class="text-center text-ctp-subtext0 italic">
  <p>{@html motd.state.motd}</p>
  <!-- Free and <a href='https://github.com/schooltape/schooltape' class='text-(--ctp-accent)'> open source</a>! -->
</div>
