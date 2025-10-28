// these utility functions are intended to be used on the dashboard, as that is where the timetable is displayed

interface PeriodHeader {
  name: string;
  time: {
    start: Date;
    end: Date;
  };
}
interface PeriodData {
  name: string;
  link: string;
  id: string;
  room: string;
}

export class Period {
  header: PeriodHeader;
  data: PeriodData;
  index: number;

  constructor(header: PeriodHeader, data: PeriodData, index: number) {
    this.header = header;
    this.data = data;
    this.index = index;
  }

  inProgress(): boolean {
    // check if it's currently the period
    const now = new Date();
    const { start, end } = this.header.time;
    return start.getTime() <= now.getTime() && now.getTime() <= end.getTime();
  }
  getProgress(): number {
    const now = new Date();
    const { start, end } = this.header.time;
    const periodDuration = end.getTime() - start.getTime();
    let progressPercentage = 0;

    if (now.getTime() >= start.getTime() && now.getTime() <= end.getTime()) {
      const elapsedTime = now.getTime() - start.getTime();
      progressPercentage = Math.min(Math.max((elapsedTime / periodDuration) * 100, 0), 100);
    } else if (now.getTime() > end.getTime()) {
      progressPercentage = 100;
    }
    // otherwise it isn't currently in progress

    return progressPercentage;
  }
}

export function getCurrentPeriod(): Period | null {
  const periodList = getListOfPeriods();
  const currentPeriod = periodList.find((period) => {
    return period.inProgress();
  });
  return currentPeriod || null;
}

export function getListOfPeriods(): Period[] {
  const periods = document.querySelectorAll(".timetable thead tr th");
  return Array.from(periods).map((_, i) => getPeriodData(i));
}

function getPeriodData(index: number): Period {
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

  if (!header) {
    throw new Error(`Failed to find header for index ${index}`);
  }

  if (!data) {
    throw new Error(`Failed to find data for index ${index}`);
  }

  const headerName = header.childNodes[0]?.textContent?.trim() || "";
  const headerTime = extractTimes(header.querySelector("time")?.textContent?.trim() || "");

  const dataName = data.querySelector("a")?.textContent?.trim() || "";
  const dataLink = data.querySelector("a")?.getAttribute("href") || "";
  const dataId = data.querySelector("div:nth-child(2)")?.textContent?.trim() || "";
  const dataRoom = data.querySelector("div:nth-child(3)")?.textContent?.trim() || "";

  return new Period(
    {
      name: headerName,
      time: headerTime,
    },
    {
      name: dataName,
      link: dataLink,
      id: dataId,
      room: dataRoom,
    },
    index,
  );
}

function extractTimes(periodTime: string): { start: Date; end: Date } {
  try {
    const times = periodTime.split("–"); // em dash

    const [start, end] = times.map((time, index) => {
      const [hourStr, minuteStr] = time.split(":");
      let hour = parseInt(hourStr);
      const minute = parseInt(minuteStr.substring(0, 2));

      const isAM = time.includes("am");

      if (!isAM && hour !== 12) {
        hour += 12;
      }
      const date = new Date();
      date.setHours(hour, minute);

      // if it's the end time
      if (index === 1) {
        date.setSeconds(59, 999);
      }

      return date;
    });
    return { start, end };
  } catch (error) {
    logger.error("Error extracting times:", error);
    throw new Error("Failed to extract times");
  }
}
