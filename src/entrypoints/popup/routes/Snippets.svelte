<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";
  import Slider from "../components/inputs/Slider.svelte";
  import TextInput from "../components/inputs/TextInput.svelte";

  let populatedSnippets: PopulatedItem<SnippetId>[] = $state([]);
  let settings = $state(globalSettings.fallback);

  let snippetURL = $state("");

  onMount(async () => {
    populatedSnippets = await populateItems(snippets, SNIPPET_INFO);
    settings = await globalSettings.getValue();
  });

  async function handleToggleChange(event: CustomEvent) {
    let settings = await globalSettings.getValue();
    settings.snippets = event.detail.checked;
    await globalSettings.setValue(settings);
  }

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

    settings.userSnippets[key] = {
      author: sections[3],
      name: getMatch(data, /\/\*\s*name:\s*(.*?)\s*\*\//) || key,
      description: getMatch(data, /\/\*\s*description:\s*(.*?)\s*\*\//) || "",
      url: snippetURL,
      toggle: true,
    };
    await globalSettings.setValue(settings);
  }

  async function toggleSnippet(snippetId: SnippetId, toggled: boolean) {
    await toggleItem(snippets, snippetId, toggled);
  }

  async function toggleUserSnippet(snippetId: string, toggled: boolean) {
    settings.userSnippets[snippetId].toggle = toggled;
    await globalSettings.setValue(settings);
  }

  async function removeUserSnippet(snippetId: string) {
    delete settings.userSnippets[snippetId];
    settings.userSnippets = settings.userSnippets; // force reactivity
    await globalSettings.setValue(settings);
  }
</script>

<div id="card">
  <Title title="Snippets" bind:checked={settings.snippets} on:change={handleToggleChange} />

  <div class="snippets-container w-full">
    {#each populatedSnippets as snippet}
      <div class="my-4 group w-full">
        <Slider
          id={snippet.id}
          bind:checked={snippet.toggle}
          on:change={() => toggleSnippet(snippet.id, snippet.toggle)}
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
    <TextInput id="snippet-input" bind:value={snippetURL} placeholder="Gist URL" label="Add" onClick={addUserSnippet} />
  </div>

  <div class="user-snippets-container w-full">
    {#each Object.entries(settings.userSnippets) as [key, snippet] (key)}
      <div class="my-4 group w-full">
        <Slider
          id={key}
          bind:checked={snippet.toggle}
          on:change={() => toggleUserSnippet(key, snippet.toggle)}
          text={snippet.name}
          description={snippet.description}
          size="small" />
        <button
          class="xsmall hover:bg-ctp-red hover:text-ctp-mantle"
          onclick={() => {
            removeUserSnippet(key);
          }}>Remove</button>
        <a href={snippet.url} target="_blank"
          ><button class="xsmall hover:bg-ctp-accent hover:text-ctp-mantle">Gist</button></a>
      </div>
    {/each}
  </div>
</div>
