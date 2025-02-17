<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";
  import Slider from "../components/inputs/Slider.svelte";
  import TextInput from "../components/inputs/TextInput.svelte";

  let snippets = snippetSettings.fallback;
  let populatedSnippets: PopulatedSnippet[] = populateItems(snippets.snippets, SNIPPET_INFO, "snippet");
  console.log(populatedSnippets);

  let snippetURL = "";

  onMount(async () => {
    snippets = await snippetSettings.getValue();
    populatedSnippets = populateItems(snippets.snippets, SNIPPET_INFO, "snippet");
    console.log(populatedSnippets);
    console.log("snippets", snippets);
  });

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

    snippets.user[key] = {
      author: sections[3],
      name: getMatch(data, /\/\*\s*name:\s*(.*?)\s*\*\//) || key,
      description: getMatch(data, /\/\*\s*description:\s*(.*?)\s*\*\//) || "",
      url: snippetURL,
      toggle: true,
    };
    await snippetSettings.setValue(snippets);
  }

  async function toggleSnippet(snippetId: string, toggled: boolean, isUser: boolean = false) {
    if (isUser) {
      snippets.user[snippetId].toggle = toggled;
    } else {
      snippets.snippets[snippetId].toggle = toggled;
    }
    await snippetSettings.setValue(snippets);
  }

  async function removeUserSnippet(snippetId: string) {
    delete snippets.user[snippetId];
    snippets.user = snippets.user; // force reactivity
    await snippetSettings.setValue(snippets);
  }
</script>

<div id="card">
  <Title title="Snippets" data={snippets} key="snippets" />

  <div class="snippets-container w-full">
    {#each populatedSnippets as snippet}
      <div class="my-4 group w-full">
        <Slider
          id={snippet.id}
          bind:checked={snippet.toggle}
          onChange={() => toggleSnippet(snippet.id, snippet.toggle)}
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
        href="https://github.com/schooltape/schooltape/wiki/Contributing#snippets"
        target="_blank">wiki</a
      >.
    </p>
    <!-- input box to make new snippet -->
    <TextInput id="snippet-input" bind:value={snippetURL} placeholder="Gist URL" label="Add" onClick={addUserSnippet} />
  </div>

  <div class="user-snippets-container w-full">
    {#each Object.entries(snippets.user) as [key, snippet] (key)}
      <div class="my-4 group w-full">
        <Slider
          id={key}
          bind:checked={snippet.toggle}
          onChange={() => toggleSnippet(key, snippet.toggle, true)}
          text={snippet.name}
          description={snippet.description}
          size="small" />
        <button
          class="xsmall hover:bg-ctp-red hover:text-ctp-mantle"
          on:click={() => {
            removeUserSnippet(key);
          }}>Remove</button>
        <a href={snippet.url} target="_blank"
          ><button class="xsmall hover:bg-ctp-accent hover:text-ctp-mantle">Gist</button></a>
      </div>
    {/each}
  </div>
</div>
