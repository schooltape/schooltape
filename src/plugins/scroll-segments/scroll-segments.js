import browser from "webextension-polyfill";

try {
  const content = document.getElementById("content");
  const footer = document.getElementById("footer");
  content.appendChild(footer);
  runUtilsFunction("injectCSS", "/plugins/scroll-segments/scroll-segments.css");
} catch (e) {
  console.error(e);
}

async function runUtilsFunction(functionName, ...args) {
  const src = browser.runtime.getURL("scripts/scriptUtils.js");
  const utils = await import(src);
  if (typeof utils[functionName] === "function") {
    utils[functionName](...args);
  } else {
    console.error(`Function ${functionName} does not exist in utils`);
  }
}
