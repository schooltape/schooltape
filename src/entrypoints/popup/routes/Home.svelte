<script lang="ts">
  import Footer from "../components/Footer.svelte";

  let label = $derived(globalSettings.state.global ? "enabled" : "disabled");
  let classList = $derived(
    globalSettings.state.global
      ? "bg-ctp-green hover:bg-(--ctp-accent) active:bg-ctp-red/75"
      : "bg-ctp-red hover:bg-(--ctp-accent) active:bg-ctp-green/75",
  );
</script>

<div id="card">
  <h1 class="mb-6">Schooltape</h1>

  <button
    class={classList}
    id="toggle"
    onclick={() => {
      globalSettings.set({ global: !globalSettings.get().global });
    }}
    >{label}
  </button>
</div>

<Footer />
