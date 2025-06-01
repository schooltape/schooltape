<script lang="ts">
  let { showModal = $bindable(), header, children } = $props();
  import { X } from "lucide-svelte";

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
  class="bg-ctp-base text-ctp-text relative m-auto">
  <!-- svelte-ignore a11y_autofocus -->
  <button autofocus onclick={() => dialog?.close()} class="small bg-ctp-surface1 absolute top-0 right-0 m-2"
    ><X /></button>

  <div class="p-4">
    {@render header?.({ class: "py-5" })}
    {@render children?.()}
  </div>
</dialog>

<style>
  dialog {
    border-radius: 10px;
    border: none;
    padding: 0;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
