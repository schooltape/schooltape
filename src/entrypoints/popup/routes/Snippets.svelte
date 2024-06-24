<script lang="ts">
  import { onMount } from "svelte";
  import Title from "../components/Title.svelte";

  let snippets = snippetSettings.defaultValue;
  let snippetURL = "";
  let populatedSnippets: PopulatedSnippet[] = [];

  onMount(async () => {
    const response = await fetch("/snippets.json");
    const data = await response.json();
    snippets = await snippetSettings.getValue();
    console.log("snippets", snippets);

    // populate default snippets
    populatedSnippets = Object.entries(data as Record<string, SnippetData>).map(([snippetId, SnippetData]) => {
      return {
        id: snippetId,
        name: SnippetData.name,
        description: SnippetData.description,
        path: SnippetData.path,
        toggle: snippets.enabled.includes(snippetId),
      };
    });
    // console.log(populatedSnippets);
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
    // console.log(data);
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
    // console.log(snippets);
  }

  async function toggleSnippet(snippetId: string, toggled: boolean, isUser: boolean = false) {
    if (isUser) {
      snippets.user[snippetId].toggle = toggled;
    } else {
      if (toggled) {
        snippets.enabled.push(snippetId);
      } else {
        snippets.enabled = snippets.enabled.filter((id) => id !== snippetId);
      }
    }
    await snippetSettings.setValue(snippets);
    // console.log(snippets);
  }

  async function removeSnippet(snippetId: string) {
    delete snippets.user[snippetId];
    snippets.user = snippets.user; // force reactivity
    await snippetSettings.setValue(snippets);
    // console.log(snippets);
  }
</script>

<div id="card">
  <Title title="Snippets" data={snippets} key="snippets" />

  <div class="snippets-container w-full">
    {#each populatedSnippets as snippet (snippet.id)}
      <div class="my-4 group w-full">
        <label class="slider-label group">
          <h4 class="text-ctp-text">{snippet.name}</h4>
          <input
            bind:checked={snippet.toggle}
            type="checkbox"
            class="peer slider-input"
            on:change={() => toggleSnippet(snippet.id, snippet.toggle)} />
          <span class="slider small"></span>
        </label>
        <div class="slider-description">
          {snippet.description}
        </div>
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
    <div class="flex justify-center items-center w-full">
      <input
        id="snippet-input"
        class="w-full p-2 rounded-l-xl bg-ctp-surface0 text-ctp-text"
        type="text"
        placeholder="Gist URL"
        bind:value={snippetURL} />
      <button class="p-2 rounded-r-xl bg-ctp-pink text-ctp-crust" type="submit" on:click={addUserSnippet}>Add</button>
    </div>
  </div>

  <div class="user-snippets-container w-full">
    {#each Object.entries(snippets.user) as [key, snippet] (key)}
      <div class="my-4 group w-full">
        <label class="slider-label group">
          <h4 class="text-ctp-text">{snippet.name}</h4>
          <input
            bind:checked={snippet.toggle}
            type="checkbox"
            class="peer slider-input"
            on:change={() => toggleSnippet(key, snippet.toggle, true)} />
          <span class="slider small"></span>
        </label>
        <div class="slider-description">
          {snippet.description}
        </div>
        <button
          class="xsmall hover:bg-ctp-red"
          on:click={() => {
            removeSnippet(key);
          }}>Remove</button>
        <a href={snippet.url} target="_blank"><button class="xsmall">Gist</button></a>
      </div>
    {/each}
  </div>
</div>
