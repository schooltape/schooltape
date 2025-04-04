<script lang="ts">
  interface Props {
    id: string;
    placeholder: string;
    value: string;
    onClick: (event: Event) => void;
    label: string;
  }

  let {
    id,
    placeholder,
    value = $bindable(),
    onClick,
    label
  }: Props = $props();
</script>

<div class="flex justify-center items-center w-full">
  <input {id} class="w-full p-2 rounded-l-xl bg-ctp-surface0 text-ctp-text" bind:value {placeholder} type="text" />
  <button class="p-2 rounded-r-xl bg-ctp-accent text-ctp-crust" type="submit" onclick={onClick}>{label}</button>
</div>
