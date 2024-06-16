<script>
  import { X } from "lucide-svelte";

  export let showModal; // boolean

  let dialog; // HTMLDialogElement

  $: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => dialog.close()}
  class="bg-ctp-base text-ctp-text relative">
  <!-- svelte-ignore a11y-autofocus -->
  <button autofocus on:click={() => dialog.close()} class="small bg-ctp-surface1 absolute top-0 right-0 m-2"
    ><X /></button>

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation class="p-4">
    <slot name="header" class="py-5" />
    <slot />
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
