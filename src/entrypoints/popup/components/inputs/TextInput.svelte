<script lang="ts">
  interface Props {
    onclick: (event: Event) => void;
    id: string;
    placeholder: string;
    value: string;
    label: string;
  }

  let { onclick, id, placeholder, value = $bindable(), label }: Props = $props();
</script>

<div class="flex w-full items-center justify-center">
  <input {id} class="bg-ctp-surface0 text-ctp-text w-full rounded-l-xl p-2" bind:value {placeholder} type="text" />
  <button class="bg-(--ctp-accent) text-ctp-crust rounded-r-xl p-2" type="submit" {onclick}>{label}</button>
</div>
