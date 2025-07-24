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

<div class="flex justify-center items-center w-full">
  <input {id} class="w-full p-2 rounded-l-xl bg-ctp-surface0 text-ctp-text" bind:value {placeholder} type="text" />
  <button class="p-2 rounded-r-xl bg-(--ctp-accent) text-ctp-crust" type="submit" {onclick}>{label}</button>
</div>
