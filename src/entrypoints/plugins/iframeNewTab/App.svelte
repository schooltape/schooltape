<script lang="ts">
  import "./app.css";
  import { globalSettings } from "@/utils/storage";
  // import { ExternalLink } from "@lucide/svelte";

  const { href } = $props();
</script>

<main class={globalSettings.state.themeFlavour}>
  <a
    {href}
    target="_blank"
    title="Open iframe in new tab"
    class="bg-ctp-surface0 absolute top-1 left-1 grid aspect-square place-items-center rounded-md p-1">
    <!-- just thhis link from lucide tnasrotnaoufwn -->
    <!--  <ExternalLink /> -->
  </a>
</main>
