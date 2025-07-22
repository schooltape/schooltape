<script>
  import { onMount } from "svelte";

  let motd = $state();

  onMount(async () => {
    // fetch MOTD from website
    try {
      const response = await fetch("https://schooltape.github.io/motd.txt");
      if (response.ok) {
        motd = await response.text();
      }
    } catch (e) {
      motd = "";
    }
  });
</script>

<!-- MOTD -->
<div class="text-ctp-subtext0 text-center italic">
  <p>{@html motd}</p>
  <!-- Free and <a href='https://github.com/schooltape/schooltape' class='text-(--ctp-accent)'> open source</a>! -->
</div>
