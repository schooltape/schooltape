<script lang="ts">
  interface Props {
    id: string;
    min: number;
    max: number;
    value: number;
    name?: string;
    description?: string;
  }

  let { id, min, max, value = $bindable(), name = "", description = "" }: Props = $props();
</script>

<div class="mt-4 space-y-2">
  {#if name}
    <label for={id} class="text-ctp-text block">{name}</label>
  {/if}
  <div class="flex items-center gap-4">
    <input
      style="--min: {min}; --max: {max}; --value: {value};"
      type="range"
      {id}
      {min}
      {max}
      bind:value
      class="styled-slider slider-progress" />
    <span id={id + "-value"} class="text-ctp-text text-sm font-medium">{value}</span>
  </div>
  {#if description}
    <p class="text-ctp-overlay1">{description}</p>
  {/if}
</div>

<style lang="postcss">
  @reference "tailwindcss";
  @reference "@catppuccin/tailwindcss/mocha.css";

  /*generated with Input range slider CSS style generator (version 20211225)
  https://toughengineer.github.io/demo/slider-styler*/
  input[type="range"].styled-slider {
    height: 1.8em;
    -webkit-appearance: none;
    appearance: none;
  }

  /*progress support*/
  input[type="range"].styled-slider.slider-progress {
    --range: calc(var(--max) - var(--min));
    --ratio: calc((var(--value) - var(--min)) / var(--range));
    --sx: calc(0.5 * 1em + var(--ratio) * (100% - 1em));
  }

  input[type="range"].styled-slider:focus {
    outline: none;
  }

  /*webkit*/
  input[type="range"].styled-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 1em;
    height: 1em;
    border-radius: 1em;
    background: var(--ctp-accent);
    border: none;
    box-shadow: none;
    margin-top: calc(0.4em * 0.5 - 1em * 0.5);
  }

  input[type="range"].styled-slider::-webkit-slider-runnable-track {
    height: 0.4em;
    border: none;
    border-radius: 0.5em;
    @apply bg-ctp-surface0;
    box-shadow: none;
  }

  input[type="range"].styled-slider::-webkit-slider-thumb:hover {
    @apply bg-(--ctp-accent) brightness-90;
  }

  input[type="range"].styled-slider.slider-progress::-webkit-slider-runnable-track {
    background:
      linear-gradient(var(--ctp-accent), var(--ctp-accent)) 0 / var(--sx) 100% no-repeat,
      theme("colors.ctp-surface0");
  }

  /*mozilla*/
  input[type="range"].styled-slider::-moz-range-thumb {
    width: 1em;
    height: 1em;
    border-radius: 1em;
    background: var(--ctp-accent);
    border: none;
    box-shadow: none;
  }

  input[type="range"].styled-slider::-moz-range-track {
    height: 0.4em;
    border: none;
    border-radius: 0.5em;
    @apply bg-ctp-surface0;
    box-shadow: none;
  }

  input[type="range"].styled-slider::-moz-range-thumb:hover {
    @apply bg-(--ctp-accent) brightness-90;
  }

  input[type="range"].styled-slider.slider-progress::-moz-range-track {
    background:
      linear-gradient(var(--ctp-accent), var(--ctp-accent)) 0 / var(--sx) 100% no-repeat,
      theme("colors.ctp-surface0");
  }

  /*ms*/
  input[type="range"].styled-slider::-ms-fill-upper {
    background: transparent;
    border-color: transparent;
  }

  input[type="range"].styled-slider::-ms-fill-lower {
    background: transparent;
    border-color: transparent;
  }

  input[type="range"].styled-slider::-ms-thumb {
    width: 1em;
    height: 1em;
    border-radius: 1em;
    background: var(--ctp-accent);
    border: none;
    box-shadow: none;
    margin-top: 0;
    box-sizing: border-box;
  }

  input[type="range"].styled-slider::-ms-track {
    height: 0.4em;
    border-radius: 0.5em;
    @apply bg-ctp-surface0;
    border: none;
    box-shadow: none;
    box-sizing: border-box;
  }

  input[type="range"].styled-slider::-ms-thumb:hover {
    @apply bg-(--ctp-accent) brightness-90;
  }

  input[type="range"].styled-slider.slider-progress::-ms-fill-lower {
    height: 0.4em;
    border-radius: 0.5em 0 0 0.5em;
    margin: 0;
    background: var(--ctp-accent);
    border: none;
    border-right-width: 0;
  }
</style>
