<script lang="ts">
  import { createEventDispatcher } from "svelte";

  interface Props {
    id: string;
    checked: boolean;
    size?: "big" | "small";
    text?: string;
    description?: string;
  }

  let { id, checked = $bindable(), size = "big", text = "", description = "" }: Props = $props();

  const dispatch = createEventDispatcher();

  function handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    checked = input.checked;
    dispatch("change", { checked });
  }
</script>

<label class="slider-label group">
  <h4 class="text-ctp-text">{text}</h4>
  <input {id} type="checkbox" class="peer slider-input" bind:checked onchange={handleChange} />
  <span class="slider {size}"></span>
</label>

<div class="slider-description">
  {description}
</div>
