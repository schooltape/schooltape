<script lang="ts">
  import Slider from "./inputs/Slider.svelte";

  interface Props {
    update: (toggled: boolean) => void;
    title?: string;
    checked: boolean;
  }

  let { update, title = "", checked }: Props = $props();
</script>

<label for="theme-toggle" class="relative flex justify-between items-center group p-2 text-xl text-ctp-text">
  <h2>{title}</h2>
  <Slider id="theme-toggle" size="big" {checked} {update} />
</label>
