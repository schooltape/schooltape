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
  <input {id} class="w-full rounded-l-xl bg-ctp-surface0 p-2 text-ctp-text" bind:value {placeholder} type="text" />
  <button class="rounded-r-xl bg-(--ctp-accent) p-2 text-ctp-crust" type="submit" {onclick}>{label}</button>
</div>
