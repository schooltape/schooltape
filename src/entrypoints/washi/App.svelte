<script lang="ts">
  import { CircleQuestionMark } from "@lucide/svelte";

  onMount(() => {
    // updated.set({ icon: false });
    // browser.runtime.sendMessage({ updateIcon: true });
  });
</script>

<main class="grid place-items-center h-full">
  <div class="bg-ctp-mantle flex flex-col gap-4 rounded-lg p-4 max-w-xs">
    <h1 class="text-lg font-bold text-ctp-pink">Sign In</h1>

    {#each schoolboxUrls.state.urls as url (url)}
      {@const name = url.split("/").pop()}
      <button
        onclick={async () => {
          const response = await fetch(`${url}/user/token`);
          const jwt = (await response.json()).token;

          window.open(`washi://auth?jwt=${jwt}&url=${url}`, "_blank");
        }}
        class="bg-ctp-base border-ctp-surface0 border-1 flex items-center gap-2 rounded-md p-2">
        {name}
      </button>
    {/each}

    <div class="text-sm text-ctp-subtext0 grid gap-2">
      <h2 class="flex items-center gap-2">
        <CircleQuestionMark size={18} /> Schoolbox not listed?
      </h2>
      <p>Simply open your dashboard in a new tab.</p>
    </div>
  </div>
</main>
