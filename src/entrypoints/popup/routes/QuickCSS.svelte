<script lang="ts">
  import CodeMirror from "svelte-codemirror-editor";
  import { catppuccinFrappe, catppuccinLatte, catppuccinMacchiato, catppuccinMocha } from "@catppuccin/codemirror";
  import { css } from "@codemirror/lang-css";
  import { globalSettings, quickCSS } from "@/utils/storage";
  import { ArrowLeft } from "@lucide/svelte";
  import { navigate } from "../router";

  const map = {
    latte: catppuccinLatte,
    frappe: catppuccinFrappe,
    macchiato: catppuccinMacchiato,
    mocha: catppuccinMocha,
  };
  let theme = $derived(map[globalSettings.state.themeFlavour]);
</script>

<div class="bg-ctp-mantle min-h-64 w-full p-6">
  <div class="mb-4 flex items-center justify-center px-4 py-2">
    <button class="bg-ctp-surface0 text-ctp-text rounded-xl p-2" title="Go Back" onclick={() => navigate("/snippets")}>
      <ArrowLeft size={22} /></button>

    <h2 class="grow text-center text-lg">Edit Quick CSS</h2>
  </div>

  <div class="w-full overflow-clip rounded-lg">
    <CodeMirror
      bind:value={quickCSS.state.value}
      {theme}
      lang={css()}
      lineWrapping
      highlight={{ activeLine: false }}
      placeholder="add your own custom CSS here!
changes will be reflected live" />
  </div>
</div>
