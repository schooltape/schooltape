<script lang="ts">
  import Slider from "./inputs/Slider.svelte";

  export let data: any = {};
  export let title = "";
  export let key = "";

  async function setStorage() {
    switch (key) {
      case "plugins":
        await pluginSettings.setValue(data);
        break;
      case "themes":
        await themeSettings.setValue(data);
        break;
      case "snippets":
        await snippetSettings.setValue(data);
        break;
      default:
        await globalSettings.setValue(data);
        browser.storage.local.set({ settings: data });
    }
  }
</script>

<label for="theme-toggle" class="relative flex justify-between items-center group p-2 text-xl text-ctp-text">
  <h2>{title}</h2>
  <Slider
    id="theme-toggle"
    bind:checked={data.toggle}
    onChange={setStorage}
    size="big" />
</label>
