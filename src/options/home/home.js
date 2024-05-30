import browser from "webextension-polyfill";

const ver = document.querySelector(".version");
verNum = "v" + browser.runtime.getManifest().version;
ver.innerHTML = verNum;
ver.href = `https://github.com/42Willow/schooltape/releases/tag/${verNum}`;

// global toggle button
browser.storage.local.get(["settings"], function (result) {
  console.log("settings is currently ", result.settings);
  let btn = document.getElementById("toggle");
  if (result.settings.global) {
    // is enabled
    btn.classList = "bg-green hover:bg-pink active:bg-red/75";
    btn.innerHTML = "enabled";
  } else {
    // is disabled
    btn.classList = "bg-red hover:bg-pink active:bg-green/75";
    btn.innerHTML = "disabled";
  }
});
document.getElementById("toggle").addEventListener("click", function () {
  browser.storage.local.get(["settings"], function (result) {
    let btn = document.getElementById("toggle");
    if (result.settings.global) {
      // toggle to false
      let newSettings = result.settings;
      newSettings.global = false;
      browser.storage.local.set({ settings: newSettings }, function () {});
      browser.runtime.sendMessage({ badgeText: true });
      btn.classList = "bg-red hover:bg-pink active:bg-green/75";
      btn.innerHTML = "disabled";
    } else {
      // toggle to true
      let newSettings = result.settings;
      newSettings.global = true;
      browser.storage.local.set({ settings: newSettings }, function () {});
      browser.runtime.sendMessage({ badgeText: true });
      btn.classList = "bg-green hover:bg-pink active:bg-red/75";
      btn.innerHTML = "enabled";
    }
  });
});

// reset toggle button
document.getElementById("reset").addEventListener("click", function () {
  if (confirm("Are you sure you want to reset all settings?")) {
    // browser.runtime.sendMessage({ resetSettings: true });
    browser.runtime.sendMessage({ resetSettings: true }, function () {});
    location.reload();
    browser.runtime.sendMessage({ badgeText: true });
  }
});

// update notifications

browser.storage.local.get(["settings"], function (result) {
  console.log("settings is currently ", result.settings);
  if (result.settings.updateReminder) {
    document.getElementById("update-notifs").checked = true;
  } else {
    document.getElementById("update-notifs").checked = false;
  }
});
// update notifications listener
document.getElementById("update-notifs").addEventListener("change", function () {
  browser.storage.local.get(["settings"], function (result) {
    if (result.settings.updateReminder === true) {
      let newSettings = result.settings;
      newSettings.updateReminder = false;
      browser.storage.local.set({ settings: newSettings }, function () {});
    } else if (result.settings.updateReminder === false) {
      let newSettings = result.settings;
      newSettings.updateReminder = true;
      browser.storage.local.set({ settings: newSettings }, function () {});
    }
  });
});
