import styleText from "./styles.css?inline";

export default function init() {
  defineStPlugin(
    "progressBar",
    () => {
      if (window.location.pathname === "/" && document.querySelector(".timetable")) {
        const periodList = getListOfPeriods();
        // console.log(periodList);

        const progressRow = document.createElement("tr");
        progressRow.classList.add("progress-container");
        document.querySelector(".timetable > thead")?.insertAdjacentElement("beforeend", progressRow);

        injectStyles(styleText);
        insertProgressBars(periodList, progressRow);
      }
    },
    [".timetable"],
  );
}

function insertProgressBars(periodList: any[], container: HTMLElement) {
  periodList.forEach((period) => {
    const td = document.createElement("td");
    const progressBar = document.createElement("progress");
    const progress = calculateProgress(period);
    progressBar.className = "progress-bar";
    progressBar.max = 100;
    progressBar.style.width = "100%";
    progressBar.value = progress;

    if (progress < 100) {
      const intervalId = setInterval(() => {
        progressBar.value = calculateProgress(period);
        if (progressBar.value === 100) {
          clearInterval(intervalId);
        }
      }, 10000);
    }

    td.appendChild(progressBar);
    container.appendChild(td);
  });
}

function calculateProgress(period: any): number {
  const now = new Date().getTime();
  const startTime = new Date(period.header.time.start).getTime();
  const endTime = new Date(period.header.time.end).getTime();
  const periodDuration = endTime - startTime;
  let progressPercentage = 0;

  if (now >= startTime && now <= endTime) {
    const elapsedTime = now - startTime;
    progressPercentage = Math.min(Math.max((elapsedTime / periodDuration) * 100, 0), 100);
  } else if (now > endTime) {
    progressPercentage = 100;
  }

  return progressPercentage;
}
