// TODO: Remove entirely!!!
export function getListOfPeriods() {
  let periodList = [];
  for (let i = 0; i < 14; i++) {
    periodList.push(getPeriodData(i));
  }
  return periodList;
}

export function getCurrentPeriod() {
  const periodList = getListOfPeriods();
  console.log(periodList);
  // const currentTime = new Date().getTime();

  // periodList.forEach((period, i) => {
  //   if (periodList[i] !== null && periodList[i].topPeriodTime !== undefined) {
  //     let times = extractTimes(periodList[i].topPeriodTime);
  //     let startTimestamp = times[0].getTime();
  //     let endTimestamp = times[1].getTime();
  //     if (startTimestamp <= currentTime && currentTime <= endTimestamp) {
  //       return i; // return current period index
  //     }
  //   }
  // });
  // return null;
}

export function extractTimes(periodTime) {
  let times = periodTime.split("–");
  let startTime = times[0].split(":");
  let startHour = parseInt(startTime[0]);
  let startMinute = parseInt(startTime[1].substring(0, 2));
  let startIsAM = startTime[1].substr(2) === "am";
  let endTime = times[1].split(":");
  let endHour = parseInt(endTime[0]);
  let endMinute = parseInt(endTime[1].substring(0, 2));
  let endIsAM = endTime[1].substr(2) === "am";

  if (!startIsAM && startHour !== 12) {
    startHour += 12;
  }
  if (!endIsAM && endHour !== 12) {
    endHour += 12;
  }

  let startDate = new Date();
  startDate.setHours(startHour, startMinute, 0, 0);
  let endDate = new Date();
  endDate.setHours(endHour, endMinute, 0, 0);

  return [startDate, endDate];
}

export function getPeriodData(index) {
  // if period number is not provided, return null
  if (index === undefined) {
    console.error("Period number was not provided");
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

  console.log(header, data);

  return {
    header: {
      name: header?.childNodes[0]?.textContent.trim() || "",
      time: header?.querySelector("time")?.textContent.trim() || "",
    },
    data: {
      name: data?.querySelector("a")?.textContent.trim() || "",
      link: data?.querySelector("a")?.getAttribute("href") || "",
      id: data?.querySelector("div:nth-child(2)")?.textContent.trim() || "",
      room: data?.querySelector("div:nth-child(3)")?.textContent.trim() || "",
    },
  };
}
