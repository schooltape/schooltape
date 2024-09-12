<script lang="ts">
  export let id: string;
  export let placeholder: string;
  export let value: string;
  export let onClick: (event: Event) => void;
  export let label: string;
</script>

<div class="flex justify-center items-center w-full">
  <input
    id={id}
    class="w-full p-2 rounded-l-xl bg-ctp-surface0 text-ctp-text"
    bind:value={value}
    placeholder={placeholder}
    type="text" />
  <button class="p-2 rounded-r-xl bg-ctp-accent text-ctp-crust" type="submit" on:click={onClick}>{label}</button>
</div>
