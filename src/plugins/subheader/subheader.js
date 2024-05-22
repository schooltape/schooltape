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

if (window.location.pathname === "/" && document.getElementsByClassName("timetable")[0]) {
  // let timetableHeader = document.querySelectorAll("[data-timetable-header]");
  // let timetableContainer = document.querySelectorAll("[data-timetable-container]");
  // let timetable = document.getElementsByClassName("timetable")[0];
  updateSubheader();
  setInterval(updateSubheader, 1000);
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

function clock() {
  let s = getDate().second;
  let m = getDate().minute;
  let h = getDate().hour;
  // If seconds is a single digit number add a zero before it
  if (s.toString().length === 1) {
    s = "0" + s;
  }
  // If minutes is a single digit number add a zero before it
  if (m.toString().length === 1) {
    m = "0" + m;
  }

  // Get meridian (AM/PM)
  let meridian = "AM";
  if (h > 12) {
    h = h - 12;
    meridian = "PM";
  }

  // return h + ":" + m + ":" + s;
  return h + ":" + m + " " + meridian;
}

function getDate() {
  let currentDate = new Date();
  let day = currentDate.getDay();
  let month = currentDate.getMonth();
  let year = currentDate.getFullYear();
  let date = currentDate.getDate();
  let hour = currentDate.getHours();
  let minute = currentDate.getMinutes();
  let second = currentDate.getSeconds();
  let dateString = currentDate.toDateString();
  return {
    day: day,
    month: month,
    year: year,
    date: date,
    hour: hour,
    minute: minute,
    second: second,
    dateString: dateString,
  };
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
