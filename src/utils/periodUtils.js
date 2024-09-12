export function getListOfPeriods() {
  const periods = document.querySelectorAll(".timetable thead tr th");
  return Array.from(periods).map((_, i) => getPeriodData(i));
}

export function getCurrentPeriod() {
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

export function getPeriodData(index) {
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

export function extractTimes(periodTime) {
  try {
    let times = periodTime.split("–"); // en dash
    let [start, end] = times.map((time, index) => {
      let [hour, minute] = time.split(":");
      let isAM = time.slice(-2).toLowerCase() === "am";
      hour = parseInt(hour);
      minute = parseInt(minute.substring(0, 2));
      if (!isAM && hour !== 12) {
        hour += 12;
      }
      let date = new Date();
      date.setHours(hour, minute);
      if (index === 1) {
        date.setSeconds(59, 999);
      }
      return date;
    });
    return { start, end };
  } catch (error) {
    console.error("Error extracting times:", error);
    return false;
  }
}
