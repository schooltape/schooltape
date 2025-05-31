<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    update: (toggled: boolean) => void;
    checked: boolean;
    id: string;
    size?: "big" | "small";
    text?: string;
    description?: string;
    children?: Snippet;
  }

  let { update, checked, id, size = "big", text = "", description = "", children }: Props = $props();
</script>

<label class="group text-ctp-text relative flex items-center justify-between py-2 text-xl">
  <h4 class="text-ctp-text">{text}</h4>
  <input
    {id}
    type="checkbox"
    class="peer absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md"
    {checked}
    onchange={(event: Event) => {
      const target = event.target as HTMLInputElement;
      update(target.checked);
    }} />
  <span class="slider {size}"></span>
</label>

<div
  class="flex items-center text-ctp-overlay1 group-hover:text-ctp-subtext0 transition-colors duration-500 ease-in-out">
  <div>{description}</div>
  <div>{@render children?.()}</div>
</div>
