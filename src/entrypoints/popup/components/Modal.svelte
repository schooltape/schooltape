<script lang="ts">
  let { showModal = $bindable(), header, children } = $props();
  import { X } from "@lucide/svelte";

  let dialog: HTMLDialogElement | undefined = $state();

  $effect(() => {
    if (showModal) dialog?.showModal();
  });
</script>

<dialog
  bind:this={dialog}
  onclose={() => (showModal = false)}
  onclick={(e) => {
    if (e.target === dialog) dialog.close();
  }}
  class="bg-ctp-base text-ctp-text open:animate-zoom-in relative m-auto w-screen rounded-lg backdrop:backdrop-blur-md">
  <button autofocus onclick={() => dialog?.close()} class="small bg-ctp-surface1 absolute top-0 right-0 m-2"
    ><X /></button>

  <div class="p-4">
    {@render header?.({ class: "py-5" })}
    {@render children?.()}
  </div>
</dialog>
