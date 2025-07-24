<script lang="ts">
  interface Props {
    id: string;
    min: number;
    max: number;
    value: number;
    update: (value: number) => void;
    name?: string;
    description?: string;
  }

  let { update, id, min, max, value, name = "", description = "" }: Props = $props();
  let currentValue = $state(value);
</script>

<div class="space-y-2 mt-4">
  {#if name}
    <label for={id} class="block text-ctp-text">{name}</label>
  {/if}
  <div class="flex items-center gap-4">
    <input
      style="--min: {min}; --max: {max}; --value: {currentValue};"
      type="range"
      onchange={(event: Event) => {
        const target = event.target as HTMLInputElement;
        update(parseInt(target.value));
      }}
      oninput={(event: Event) => {
        const target = event.target as HTMLInputElement;
        currentValue = parseInt(target.value);
      }}
      {id}
      {min}
      {max}
      {value}
      class="styled-slider slider-progress" />
    <span id={id + "-value"} class="text-sm font-medium text-ctp-text">{currentValue}</span>
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
