<script lang="ts">
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

<label class="relative flex justify-between items-center group p-2 text-xl text-ctp-text">
  <h2>{title}</h2>
  <input
    id="theme-toggle"
    type="checkbox"
    class="peer slider-input"
    bind:checked={data.toggle}
    on:change={setStorage} />
  <span class="slider big"></span>
</label>
