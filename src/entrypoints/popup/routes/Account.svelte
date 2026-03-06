<script lang="ts">
  import { onMount } from "#imports";
  import { navigate } from "../router";
  import { auth } from "@/utils/storage";

  onMount(() => {
    auth.get().then((auth) => {
      if (!auth.loggedIn) {
        navigate("/account/signup");
      }
    });
  });
</script>
