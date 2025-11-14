<script lang="ts">
  import Title from "../components/Title.svelte";
  import Toggle from "../components/inputs/Toggle.svelte";
  import TextInput from "../components/inputs/TextInput.svelte";

  let snippetURL = $state("");

  async function addUserSnippet() {
    if (!snippetURL.startsWith("http") && !snippetURL.includes("gist.github.com")) {
      alert("Invalid URL. Please enter a valid Gist URL.");
      return;
    }
    // create new user snippet from URL (snippetURL)
    // eg. https://gist.github.com/42Willow/e89e76ef3853e83a6439ffba42f7d273
    const response = await fetch(snippetURL + "/raw");
    const data = await response.text();
    const getMatch = (snippet: string, regex: RegExp) => {
      const match = snippet.match(regex);
      return match ? match[1] : null;
    };
    let sections = snippetURL.split("/");
    let key = sections[sections.length - 1].split(".")[0];

    let settings = await globalSettings.storage.getValue();
    settings.userSnippets[key] = {
      author: sections[3],
      name: getMatch(data, /\/\*\s*name:\s*(.*?)\s*\*\//) || key,
      description: getMatch(data, /\/\*\s*description:\s*(.*?)\s*\*\//) || "",
      url: snippetURL,
      toggle: true,
    };
    await globalSettings.storage.setValue(settings);
  }
</script>

<div id="card">
  <Title
    title="Snippets"
    checked={globalSettings.state.snippets}
    update={(toggled: boolean) => {
      globalSettings.set({ snippets: toggled });
    }} />

  <div class="snippets-container w-full">
    {#each Object.entries(snippets) as [id, snippet] (id)}
      <div class="group my-4 w-full">
        <Toggle
          {id}
          checked={snippet.toggle.state.toggle}
          update={(toggled: boolean) => {
            snippet.toggle.set({ toggle: toggled });
          }}
          text={snippet.name}
          description={snippet.description}
          size="small" />
      </div>
    {/each}
  </div>
  <div class="w-full">
    <h3 class="text-ctp-text my-4">User Snippets</h3>
    <p class="text-ctp-overlay2 mb-4">
      To learn how to make your own snippets, please read the
      <a
        class="text-ctp-blue hover:underline"
        href="https://schooltape.github.io/contributing/snippets.html#user-snippets"
        target="_blank">wiki</a
      >.
    </p>
    <!-- input box to make new snippet -->
    <TextInput id="snippet-input" bind:value={snippetURL} placeholder="Gist URL" label="Add" onclick={addUserSnippet} />
  </div>

  <div class="user-snippets-container w-full">
    {#each Object.entries(globalSettings.state.userSnippets as Record<string, UserSnippet>) as [id, snippet] (id)}
      <div class="group my-4 w-full">
        <Toggle
          {id}
          checked={snippet.toggle}
          update={async (toggled: boolean) => {
            let settings = await globalSettings.storage.getValue();
            settings.userSnippets[id].toggle = toggled;
            await globalSettings.storage.setValue(settings);
          }}
          text={snippet.name}
          description={snippet.description}
          size="small" />
        <button
          class="xsmall hover:bg-ctp-red hover:text-ctp-mantle"
          onclick={async () => {
            let settings = await globalSettings.storage.getValue();
            delete settings.userSnippets[id];
            await globalSettings.storage.setValue(settings);
          }}>Remove</button>
        <a href={snippet.url} target="_blank"
          ><button class="xsmall hover:text-ctp-mantle hover:bg-(--ctp-accent)">Gist</button></a>
      </div>
    {/each}
  </div>
</div>
