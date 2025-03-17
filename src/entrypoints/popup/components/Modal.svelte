<script lang="ts">
  import { run, self, createBubbler, stopPropagation } from 'svelte/legacy';

  const bubble = createBubbler();
  import { X } from "lucide-svelte";

  interface Props {
    showModal: boolean;
    header?: import('svelte').Snippet<[any]>;
    children?: import('svelte').Snippet;
  }

  let { showModal = $bindable(), header, children }: Props = $props();

  let dialog: HTMLDialogElement = $state();

  run(() => {
    if (dialog && showModal) dialog.showModal();
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialog}
  onclose={() => (showModal = false)}
  onclick={self(() => dialog.close())}
  class="bg-ctp-base text-ctp-text relative">
  <!-- svelte-ignore a11y_autofocus -->
  <button autofocus onclick={() => dialog.close()} class="small bg-ctp-surface1 absolute top-0 right-0 m-2"
    ><X /></button>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div onclick={stopPropagation(bubble('click'))} class="p-4">
    {@render header?.({ class: "py-5", })}
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
