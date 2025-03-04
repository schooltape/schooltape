<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let id: string;
  export let checked: boolean;
  export let size: "big" | "small" = "big";
  export let text: string = "";
  export let description: string = "";

  const dispatch = createEventDispatcher();

  function handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    checked = input.checked;
    dispatch("change", { checked });
  }
</script>

<label class="slider-label group">
  <h4 class="text-ctp-text">{text}</h4>
  <input {id} type="checkbox" class="peer slider-input" bind:checked on:change={handleChange} />
  <span class="slider {size}"></span>
</label>

<div class="slider-description">
  {description}
</div>
