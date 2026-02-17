<script lang="ts">
  import { Eye, EyeClosed } from "@lucide/svelte";

  interface Props {
    id: string;
    placeholder: string;
    value: string;
    password?: boolean;
  }

  let { id, placeholder, value = $bindable(), password }: Props = $props();

  let passwordHidden = $state(true);
</script>

<div>
  <div class="relative mt-1 flex items-center justify-end">
    <input
      {id}
      {placeholder}
      bind:value
      type={password ? (passwordHidden ? "password" : "text") : "text"}
      class="bg-ctp-surface0 w-full rounded-sm px-4 py-2 placeholder:text-sm" />

    {#if password}
      <button onclick={() => (passwordHidden = !passwordHidden)} class="absolute mr-4">
        {#if passwordHidden}
          <Eye size={22} />
        {:else}
          <EyeClosed size={22} />
        {/if}
      </button>
    {/if}
  </div>
</div>
