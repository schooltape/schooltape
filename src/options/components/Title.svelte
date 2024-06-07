<script>
  import browser from "webextension-polyfill";

  export let data = {};
  export let title = "";
  export let key = "";

  function setStorage() {
    browser.storage.local.set({ [key]: data });
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
