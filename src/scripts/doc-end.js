// This is for:
// - Plugins (that alter the DOM after is has been loaded)

// inject enabled plugins if the current URL is stored as Schoolbox and extension is enabled
chrome.storage.local.get(["settings"], function (data) {
  if (data.settings.global) {
    if (data.settings.urls.includes(window.location.origin)) {
      for (let i = 0; i < data.settings.enabledPlugins.length; i++) {
        runUtilsFunction("injectPlugin", data.settings.enabledPlugins[i], "doc-end");
      }
    }
  }
});

// check if the page is Schoolbox, if not add it to storage and reload the page
let footer = document.querySelector("#footer > ul");
if (footer.innerHTML.includes("Schoolbox")) {
  let footerListItem = document.createElement("li");
  footerListItem.appendChild(document.createElement("a")).href = "https://github.com/42willow/schooltape";
  footerListItem.firstChild.textContent = `Schooltape v${chrome.runtime.getManifest().version}`;
  footer.appendChild(footerListItem);
  chrome.storage.local.get("settings", function ({ settings }) {
    if (!settings.urls.includes(window.location.origin)) {
      settings.urls.push(window.location.origin);
      chrome.storage.local.set({ settings: settings });
      // TODO: hot reload
      window.location.reload();
    }
  });
}

async function runUtilsFunction(functionName, ...args) {
  const src = chrome.runtime.getURL("scripts/utils.js");
  const utils = await import(src);
  if (typeof utils[functionName] === "function") {
    utils[functionName](...args);
  } else {
    console.error(`Function ${functionName} does not exist in utils`);
  }
}
