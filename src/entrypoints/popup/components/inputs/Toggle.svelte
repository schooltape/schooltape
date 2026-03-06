<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    checked: boolean;
    id: string;
    size?: "big" | "small";
    text?: string;
    description?: string;
    children?: Snippet;
  }

  let { checked = $bindable(), id, size = "big", text = "", description = "", children }: Props = $props();
</script>

<div>
  <label class="group text-ctp-text relative flex cursor-pointer items-center justify-between py-2">
    <h4 class="text-ctp-text">{text}</h4>
    <input
      {id}
      type="checkbox"
      class="peer absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md"
      bind:checked />
    <span class="slider {size}"></span>
  </label>

  <div
    class="text-ctp-overlay1 group-hover:text-ctp-subtext0 flex items-center justify-between gap-2 transition-colors duration-500 ease-in-out">
    <div>{description}</div>
    {@render children?.()}
  </div>
</div>
