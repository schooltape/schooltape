<script>
  import "./app.css";
  import { Command, Search } from "@lucide/svelte";
  let name = $state("world");
  let count = $state(0);
</script>

<main class="font-lexend text-ctp-text grid h-screen w-screen place-items-center text-base">
  <div class="bg-ctp-mantle border-ctp-surface0 flex min-w-sm flex-col overflow-clip rounded-lg border-2">
    <div class="border-ctp-surface0 flex items-center gap-2 border-b-2 p-2">
      <Search class="size-4" />
      <input class="placeholder:text-ctp-subtext0 w-full" bind:value={name} placeholder="Search anything..." />

      <div class="flex gap-1">
        <span class="bg-ctp-surface0 size-4 rounded-sm p-[2px]"><Command class="size-3" /></span>
        <span class="bg-ctp-surface0 size-4 rounded-sm p-[2px] text-xs">K</span>
      </div>
    </div>

    <h1>Hello {name}!</h1>
    <button onclick={() => (count += 1)}>
      clicks: {count}
    </button>
  </div>
</main>
