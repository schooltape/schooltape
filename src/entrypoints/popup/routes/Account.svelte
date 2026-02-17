<script lang="ts">
  import { account } from "@/utils/appwrite";
  import { ID } from "appwrite";
  import TextInput from "../components/inputs/TextInput.svelte";
  import Button from "../components/inputs/Button.svelte";
  import { onMount } from "#imports";
  import { navigate } from "../router";

  let loggedIn = $state(false);

  onMount(async () => {
    try {
      await account.get();
      loggedIn = true;
    } catch {
      navigate("/account/signup");
    }
  });
</script>
