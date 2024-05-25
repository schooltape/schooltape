// DEBUG: set time to 8:55am
const _Date = Date;
Date = function (...args) {
  if (args.length === 0) {
    // Return the artificial date
    return new _Date("2021-01-01T08:55:00");
  } else {
    // Call the original Date constructor
    return new _Date(...args);
  }
};
Date.prototype = _Date.prototype;
// END DEBUG

let style = document.createElement("style");
style.classList = "schooltape";
style.innerHTML = `
  .subheader span:not(:last-child)::after {
    content: " | ";
    font-weight: bold;
  }
`;
document.head.appendChild(style);

if (window.location.pathname === "/" && document.getElementsByClassName("timetable")[0]) {
  createSubheader();
  // updateSubheader();
  // setInterval(updateSubheader, 1000);
}

async function createSubheader() {
  const subheader = document.querySelector("h2.subheader");
  // delete all children of the subheader
  while (subheader.firstChild) {
    subheader.removeChild(subheader.firstChild);
  }
  const span = document.createElement("span");
  span.classList = "schooltape";
  subheader.appendChild(span);

  const date = new Date();

  // period
  let period = await runUtilsFunction("getCurrentPeriod");
  if (period) {
    console.log("period: ", period);
    let periodSpan = document.createElement("span");
    periodSpan.classList.add("period");
    span.appendChild(periodSpan);
  } else {
    console.error("Failed to get current period");
  }
  // clock
  let clockSpan = document.createElement("span");
  clockSpan.classList.add("clock");
  clockSpan.textContent = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  span.appendChild(clockSpan);

  // date
  let dateSpan = document.createElement("span");
  dateSpan.classList.add("date");
  dateSpan.textContent = date.toDateString();
  span.appendChild(dateSpan);
}

// Function with interval of one second to update the subheader
function updateSubheader() {
  // console.log(clock());
  // console.log("Updating subheader");
  let currentPeriod = runUtilsFunction("getCurrentPeriod");
  console.log("currentPeriod: ", currentPeriod);

  // let subHeader = document.querySelector("h2.subheader");
  // let currentPeriod = runUtilsFunction("getCurrentPeriod");

  // let currentPeriodData = runUtilsFunction("getPeriodData", currentPeriod);
  // // console.log("currentPeriodData: ", currentPeriodData)

  // if (currentPeriodData === null) {
  //   // Failed to retrieve any data
  //   subHeader.innerHTML = getDate().dateString + " <strong>|</strong> " + clock();
  // } else if (currentPeriodData.missingData) {
  //   // Missing period info
  //   subHeader.innerHTML =
  //     currentPeriodData.topPeriodName +
  //     " <strong>|</strong> " +
  //     getDate().dateString +
  //     " <strong>|</strong> " +
  //     clock();
  // } else {
  //   subHeader.innerHTML = `<a style='color: inherit;' href='${currentPeriodData.periodLink}' target='_blank'>${currentPeriodData.periodName} (${currentPeriodData.periodRoom})</a> <strong>|</strong> ${getDate().dateString} <strong>|</strong> ${clock()}`;
  // }
}

async function runUtilsFunction(functionName, ...args) {
  const src = chrome.runtime.getURL("plugins/pluginUtils.js");
  const utils = await import(src);
  if (typeof utils[functionName] === "function") {
    return utils[functionName](...args);
  } else {
    console.error(`Function ${functionName} does not exist in utils`);
  }
}
