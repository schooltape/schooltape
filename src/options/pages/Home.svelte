<script>
  import Footer from "../components/Footer.svelte";
  import browser from "webextension-polyfill";
  import { onMount } from "svelte";

  let settings;
  let btnText;
  let btnClass;
  let updateToggle;

  onMount(async () => {
    const storage = await browser.storage.local.get();
    console.log("storage", storage);
    settings = storage.settings;
    updateToggle = storage.settings.updates.toggle;
    console.log("settings", settings);
    updateButton();
  });

  function updateButton() {
    if (settings.global) {
      btnClass = 'bg-ctp-green hover:bg-ctp-pink active:bg-ctp-red/75';
      btnText = 'enabled';
    } else {
      btnClass = 'bg-ctp-red hover:bg-ctp-pink active:bg-ctp-green/75';
      btnText = 'disabled';
    }
  }

  async function toggle() {
    settings.global = !settings.global;
    await browser.storage.local.set({ settings });
    browser.runtime.sendMessage({ badgeText: true });
    updateButton();
  }

  async function toggleUpdates() {
    const result = await browser.storage.local.get('settings');
    let newSettings = result.settings;
    newSettings.updates.toggle = !newSettings.updates.toggle;
    await browser.storage.local.set({ settings: newSettings });
    updateToggle = newSettings.updates.toggle;
  }


  // // update notifications

  // browser.storage.local.get(["settings"], function (result) {
  //   console.log("settings is currently ", result.settings);
  //   if (result.settings.updateReminder) {
  //     document.getElementById("update-notifs").checked = true;
  //   } else {
  //     document.getElementById("update-notifs").checked = false;
  //   }
  // });
  // // update notifications listener
  // document.getElementById("update-notifs").addEventListener("change", function () {
  //   browser.storage.local.get(["settings"], function (result) {
  //     if (result.settings.updateReminder === true) {
  //       let newSettings = result.settings;
  //       newSettings.updateReminder = false;
  //       browser.storage.local.set({ settings: newSettings }, function () {});
  //     } else if (result.settings.updateReminder === false) {
  //       let newSettings = result.settings;
  //       newSettings.updateReminder = true;
  //       browser.storage.local.set({ settings: newSettings }, function () {});
  //     }
  //   });
  // });
</script>

<div id="card" class="from-ctp-mantle to-ctp-crust outline-ctp-pink">
  <h1 class="mb-6 from-ctp-blue to-ctp-teal">Schooltape</h1>

  <button class={btnClass} id="toggle" on:click={toggle}>{btnText}</button>

  <label class="group relative mt-6 flex items-center justify-between p-2 text-lg text-ctp-text">
    <h4>Update Notifications</h4>
    <input
      bind:checked={updateToggle}
      on:change={toggleUpdates}
      type="checkbox"
      class="peer absolute left-1/2 h-full w-full -translate-x-1/2 appearance-none rounded-md" />
    <span
      class="ml-4 flex h-8 w-14 flex-shrink-0 items-center rounded-lg bg-ctp-red p-1 duration-500 ease-in-out after:h-6 after:w-6 after:rounded-lg after:bg-ctp-base after:shadow-md after:duration-300 group-hover:after:translate-x-1 peer-checked:bg-ctp-green peer-checked:after:translate-x-6"></span>
  </label>

</div>

<Footer />
