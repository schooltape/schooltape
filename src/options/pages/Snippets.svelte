<script>
  import { onMount } from "svelte";
  import browser from "webextension-polyfill";
  import Title from "../components/Title.svelte";

  let snippets = {
    toggle: false,
    user: [],
  };
  let snippetURL = "";
  let defaultSnippets = [];

  onMount(async () => {
    const response = await fetch("/snippets.json");
    const data = await response.json();
    const storage = await browser.storage.local.get();
    snippets = storage.snippets;
    console.log("snippets", snippets);

    // populate default snippets
    defaultSnippets = Object.entries(data).map(([snippetId, snippetData]) => {
      return {
        id: snippetId,
        name: snippetData.name,
        description: snippetData.description,
        path: snippetData.path,
        toggled: storage.snippets.enabled.includes(snippetId),
      };
    });
    // console.log(defaultSnippets);
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
    const getMatch = (snippet, regex) => {
      const match = snippet.match(regex);
      return match ? match[1] : null;
    };
    let sections = snippetURL.split("/");
    let key = sections[sections.length - 1].split(".")[0];

    snippets.user[key] = {
      author: sections[3],
      name: getMatch(data, /\/\*\s*name:\s*(.*?)\s*\*\//),
      description: getMatch(data, /\/\*\s*description:\s*(.*?)\s*\*\//),
      url: snippetURL,
      toggled: true,
    };
    await browser.storage.local.set({ snippets: snippets });
    // console.log(snippets);
  }

  async function toggleSnippet(snippetId, toggled, isUser = false) {
    if (isUser) {
      snippets.user[snippetId].toggled = toggled;
    } else {
      if (toggled) {
        snippets.enabled.push(snippetId);
      } else {
        snippets.enabled = snippets.enabled.filter((id) => id !== snippetId);
      }
    }
    await browser.storage.local.set({ snippets: snippets });
  }

  async function removeSnippet(snippetId) {
    delete snippets.user[snippetId];
    snippets.user = {...snippets.user}; // force reactivity
    await browser.storage.local.set({ snippets: snippets });
  }
</script>

<div id="card">
  <Title title="Snippets" data={snippets} key="snippets" />

  <div class="snippets-container w-full">
    {#each defaultSnippets as snippet (snippet.id)}
      <div class="my-4 group w-full">
        <label class="relative flex justify-between items-center group py-2 text-xl text-ctp-text">
          <h4 class="text-ctp-text">{snippet.name}</h4>
          <input
            snippet-id={snippet.id}
            bind:checked={snippet.toggled}
            type="checkbox"
            class="peer slider-input"
            on:change={() => toggleSnippet(snippet.id, snippet.toggled)} />
          <span class="slider small"></span>
        </label>
        <div class="text-ctp-overlay1 group-hover:text-ctp-subtext0 transition-colors duration-500 ease-in-out">
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
        href="https://github.com/42Willow/schooltape/wiki/Contributing#snippets"
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
        <label class="relative flex justify-between items-center group py-2 text-xl text-ctp-text">
          <h4 class="text-ctp-text">{snippet.name}</h4>
          <input
            bind:checked={snippet.toggled}
            type="checkbox"
            class="peer slider-input"
            on:change={() => toggleSnippet(key, snippet.toggled, true)} />
          <span class="slider small"></span>
        </label>
        <div class="text-ctp-overlay1 group-hover:text-ctp-subtext0 transition-colors duration-500 ease-in-out">
          {snippet.description}
        </div>
        <button class="xsmall hover:bg-ctp-red" on:click={() => { removeSnippet(key); }}>Remove</button>
        <a href={snippet.url} target="_blank"><button class="xsmall">Gist</button></a>
      </div>
    {/each}
  </div>
</div>
