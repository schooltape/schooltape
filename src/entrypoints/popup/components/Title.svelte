<script lang="ts">
  import Toggle from "./inputs/Toggle.svelte";

  interface Props {
    update: (toggled: boolean) => void;
    title?: string;
    checked: boolean;
  }

  let { update, title = "", checked }: Props = $props();
</script>

<label for="theme-toggle" class="relative flex justify-between items-center group p-2 text-xl text-ctp-text">
  <h2>{title}</h2>
  <Toggle id="theme-toggle" size="big" {checked} {update} />
</label>
