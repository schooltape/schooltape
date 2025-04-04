<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Slider from "./inputs/Slider.svelte";

  interface Props {
    title?: string;
    checked: boolean;
  }

  let { title = "", checked = $bindable() }: Props = $props();

  const dispatch = createEventDispatcher();

  function handleChange(event: CustomEvent) {
    checked = event.detail.checked;
    dispatch("change", { checked });
  }
</script>

<label for="theme-toggle" class="relative flex justify-between items-center group p-2 text-xl text-ctp-text">
  <h2>{title}</h2>
  <Slider id="theme-toggle" size="big" bind:checked on:change={handleChange} />
</label>
