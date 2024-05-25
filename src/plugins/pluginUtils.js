export function getListOfPeriods() {
  const periods = document.querySelectorAll(".timetable thead tr th");
  return Array.from(periods).map((_, i) => getPeriodData(i));
}

export function getCurrentPeriod() {
  const periodList = getListOfPeriods();
  // console.log(periodList);
  const currentTime = new Date().getTime();

  periodList.forEach((period, i) => {
    if (period.header.time) {
      const { start, end } = period.header.time;
      if (start.getTime() <= currentTime && currentTime <= end.getTime()) {
        // console.log("period: ", period, i);
        return period; // return current period data
      }
    }
  });
  return null;
}

function extractTimes(periodTime) {
  try {
    let times = periodTime.split("–");
    let [start, end] = times.map((time) => {
      let [hour, minute] = time.split(":");
      let isAM = minute.substr(2) === "am";
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
  };
}
