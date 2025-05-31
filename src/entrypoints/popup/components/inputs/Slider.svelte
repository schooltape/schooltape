<script lang="ts">
  interface Props {
    update: (toggled: boolean) => void;
    checked: boolean;
    id: string;
    size?: "big" | "small";
    text?: string;
    description?: string;
  }

  let { update, checked, id, size = "big", text = "", description = "" }: Props = $props();
</script>

<label class="slider-label group">
  <h4 class="text-ctp-text">{text}</h4>
  <input
    {id}
    type="checkbox"
    class="peer slider-input"
    {checked}
    onchange={(event: Event) => {
      const target = event.target as HTMLInputElement;
      update(target.checked);
    }} />
  <span class="slider {size}"></span>
</label>

<div class="slider-description">
  {description}
</div>
