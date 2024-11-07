<script lang="ts">
  export let id: string;
  export let checked: boolean;
  export let onChange: (event: Event) => void;
  export let size: "big" | "small" = "big";
  export let text: string = "";
  export let description: string = "";
</script>

<label class="slider-label group">
  <h4 class="text-ctp-text">{text}</h4>
  <input {id} type="checkbox" class="peer slider-input" bind:checked on:change={onChange} />
  <span class="slider {size}"></span>
</label>

<div class="slider-description">
  {description}
</div>
