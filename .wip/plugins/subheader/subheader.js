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
  .subheader a {
    color: inherit;
  }
`;
document.head.appendChild(style);

if (window.location.pathname === "/" && document.getElementsByClassName("timetable")[0]) {
  createSubheader();
  setInterval(updatePeriodSpan, 5000);
  setInterval(updateClockSpan, 1000);
  setInterval(updateDateSpan, 60000);
}

function createSubheader() {
  const subheader = document.querySelector("h2.subheader");
  // TODO: Refactor to support hot reload/uninjection
  // delete all children of the subheader
  while (subheader.firstChild) {
    subheader.removeChild(subheader.firstChild);
  }
  const span = document.createElement("span");
  span.classList = "schooltape";
  subheader.appendChild(span);

  updatePeriodSpan();
  updateClockSpan();
  updateDateSpan();
}

function updatePeriodSpan() {
  let periodSpan = document.querySelector(".subheader .period");
  if (!periodSpan) {
    const subheader = document.querySelector(".subheader .schooltape");
    periodSpan = document.createElement("span");
    periodSpan.classList.add("period");
    subheader.appendChild(periodSpan);
  }

  let period = getCurrentPeriod();
  if (period) {
    const name = period.data.name || period.header.name;
    const room = period.data.room ? ` (${period.data.room})` : "";
    let periodLink = periodSpan.querySelector("a");
    if (period.data.name && period.data.link) {
      // if there's period data
      if (!periodLink) {
        periodLink = document.createElement("a");
        periodLink.target = "_blank";
        periodSpan.appendChild(periodLink);
      }
      periodLink.href = period.data.link;
      periodLink.textContent = `${name}${room}`;
    } else {
      // if there's only the header
      periodSpan.textContent = `${name}${room}`;
      if (periodLink) {
        periodSpan.removeChild(periodLink);
      }
    }
  }
}

function updateClockSpan() {
  let clockSpan = document.querySelector(".subheader .clock");
  if (!clockSpan) {
    const subheader = document.querySelector(".subheader .schooltape");
    clockSpan = document.createElement("span");
    clockSpan.classList.add("clock");
    subheader.appendChild(clockSpan);
  }
  let date = new Date();
  clockSpan.textContent = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function updateDateSpan() {
  let dateSpan = document.querySelector(".subheader .date");
  if (!dateSpan) {
    const subheader = document.querySelector(".subheader .schooltape");
    dateSpan = document.createElement("span");
    dateSpan.classList.add("date");
    subheader.appendChild(dateSpan);
  }
  let date = new Date();
  dateSpan.textContent = date.toDateString();
}

// Period Utils (content scripts do not have support for modules)

function getListOfPeriods() {
  const periods = document.querySelectorAll(".timetable thead tr th");
  return Array.from(periods).map((_, i) => getPeriodData(i));
}

function getCurrentPeriod() {
  const periodList = getListOfPeriods();
  const currentTime = new Date().getTime();
  const currentPeriod = periodList.find((period) => {
    if (period.header.time) {
      const { start, end } = period.header.time;
      // console.log("start time: ", start.getTime(), "end time: ", end.getTime()); // log the start and end times
      if (start.getTime() <= currentTime && currentTime <= end.getTime()) {
        return true;
      }
    }
    return false;
  });
  // console.log("currentPeriod: ", currentPeriod); // log the currentPeriod
  return currentPeriod || null;
}

function getPeriodData(index) {
  if (typeof index !== "number") {
    console.error("Period number was not provided or is not a number");
    return null;
  }

  index += 1;
  // Example data structure:
  // {
  //   header: {
  //     name: "Period 1"
  //     time: "8:30am-8-44am"
  //   },
  //   data: {
  //     name: "Programming - Schooltape"
  //     link: "/home/page/code/schooltape"
  //     id: "(-ST-CC)"
  //     room: "Library"
  //   }
  // }
  const header = document.querySelector(`.timetable thead tr th:nth-child(${index})`);
  const data = document.querySelector(`.timetable tbody tr td:nth-child(${index}) div:nth-child(1) div:nth-child(1)`);

  // console.log(header, data);

  return {
    header: {
      name: header?.childNodes[0]?.textContent.trim() || null,
      time: extractTimes(header?.querySelector("time")?.textContent.trim()) || null,
    },
    data: {
      name: data?.querySelector("a")?.textContent.trim() || null,
      link: data?.querySelector("a")?.getAttribute("href") || null,
      id: data?.querySelector("div:nth-child(2)")?.textContent.trim() || null,
      room: data?.querySelector("div:nth-child(3)")?.textContent.trim() || null,
    },
    index: index,
  };
}

function extractTimes(periodTime) {
  try {
    let times = periodTime.split("–"); // en dash
    let [start, end] = times.map((time) => {
      let [hour, minute] = time.split(":");
      let isAM = time.slice(-2) === "am";
      hour = parseInt(hour);
      minute = parseInt(minute.substring(0, 2));
      if (!isAM && hour !== 12) {
        hour += 12;
      }
      let date = new Date();
      date.setHours(hour, minute, 0, 0);
      return date;
    });
    return { start, end };
  } catch (error) {
    console.error(error);
    return false;
  }
}
