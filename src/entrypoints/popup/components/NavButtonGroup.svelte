<script lang="ts">
  let { children } = $props();
</script>

<div
  class="flex justify-center overflow-clip rounded-xl bg-ctp-surface0 outline-1 outline-ctp-overlay2/20 outline-solid">
  {@render children()}
</div>
