const timetable = document.querySelector("[data-timetable-container] div.scrollable");

setTimeout(updateScrollbar, 500);
setInterval(updateScrollbar, 10000);

function updateScrollbar() {
  const periodNum = runUtilsFunction("getCurrentPeriod");
  if (periodNum !== undefined) {
    try {
      const timetableRow = document.querySelector(".timetable tbody tr");
      const currentData = timetableRow.querySelector(`td:nth-child(${periodNum})`);
      timetable.scroll({
        left: currentData.offsetLeft - 55, // 16 for perfect alignment
        behavior: "smooth", // or 'auto' to scroll instantly
      });
    } catch (error) {
      console.error("Error updating scrollbar:", error);
    }
  }
}

async function runUtilsFunction(functionName, ...args) {
  const src = chrome.runtime.getURL("plugins/pluginUtils.js");
  const utils = await import(src);
  if (typeof utils[functionName] === "function") {
    utils[functionName](...args);
  } else {
    console.error(`Function ${functionName} does not exist in utils`);
  }
}
