<script lang="ts">
  import { onMount } from "svelte";

  onMount(async () => {
    // update MOTD
    const response = await fetch("https://schooltape.github.io/motd.txt");
    if (response.ok) {
      globalSettings.set({ motd: await response.text() });
    }
  });
</script>

<!-- MOTD -->
<div class="text-ctp-subtext0 text-center italic">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  <p>{@html globalSettings.state.motd}</p>
  <!-- Free and <a href='https://github.com/schooltape/schooltape' class='text-(--ctp-accent)'> open source</a>! -->
</div>
