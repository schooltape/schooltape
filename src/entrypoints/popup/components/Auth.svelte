<script lang="ts">
  import { account } from "@/utils/appwrite";
  import { ID } from "appwrite";
  import TextInput from "../components/inputs/TextInput.svelte";
  import Button from "../components/inputs/Button.svelte";

  let email = $state("");
  let password = $state("");

  let {
    mode,
  }: {
    mode: "signup" | "login";
  } = $props();
</script>

<div class="text-ctp-text my-4 flex w-full flex-col gap-3">
  <h2 class="text-center text-2xl font-semibold">
    {mode === "signup" ? "Register" : "Login"}
  </h2>

  <div>
    <span class="text-sm">Email</span>
    <TextInput id="email" bind:value={email} placeholder="Email" />
  </div>

  <div>
    <span class="flex w-full justify-between text-sm">
      Password

      {#if mode === "login"}
        <button
          class="text-(--ctp-accent) underline"
          onclick={() => {
            //TODO
          }}>Forgot Password?</button>
      {/if}
    </span>
    <TextInput id="password" bind:value={password} placeholder="Password" password />
  </div>
</div>

<button
  class="text-ctp-base text-md mt-4 w-full rounded-xl bg-(--ctp-accent) py-2 hover:bg-(--ctp-accent)/80 active:bg-(--ctp-accent)/60"
  onclick={async () => {
    const user = await account.create({
      userId: ID.unique(),
      email,
      password,
    });
    console.log(user);
  }}>
  {mode === "signup" ? "Create Account" : "Login"}
</button>

<div class="mt-4 flex flex-col items-center gap-1">
  <p class="text-ctp-subtext0">
    {#if mode === "signup"}
      Already have an account? <a class="text-(--ctp-accent)" href="#/account/login">Log in</a>
    {:else}
      Don't have an account? <a class="text-(--ctp-accent)" href="#/account/signup">Sign up</a>
    {/if}
  </p>

  {#if mode === "signup"}
    <p class="text-ctp-subtext0 text-xs">
      By signing up, you agree to our <a
        class="text-(--ctp-accent) hover:underline"
        href="https://github.com/schooltape/.github/blob/main/PRIVACY_POLICY.md">Privacy Policy</a>
    </p>
  {/if}
</div>
