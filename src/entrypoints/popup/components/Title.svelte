<script lang="ts">
  import Toggle from "./inputs/Toggle.svelte";

  interface Props {
    title?: string;
    checked: boolean;
  }

  let { title = "", checked = $bindable() }: Props = $props();
</script>

<label for="theme-toggle" class="group text-ctp-text relative flex items-center justify-between p-2 text-xl">
  <h2>{title}</h2>
  <Toggle id="theme-toggle" size="big" {checked} />
</label>
