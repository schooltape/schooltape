import styleText from "./styles.css?inline";

export default function init() {
  definePlugin(
    "progressBar",
    () => {
      if (window.location.pathname === "/" && document.querySelector(".timetable")) {
        const periodList = getListOfPeriods();

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

function insertProgressBars(periodList: Period[], container: HTMLElement) {
  periodList.forEach((period) => {
    const td = document.createElement("td");
    const progressBar = document.createElement("progress");
    const progress = period.getProgress();
    progressBar.className = "progress-bar";
    progressBar.max = 100;
    progressBar.style.width = "100%";
    progressBar.value = progress;

    if (progress < 100) {
      const intervalId = setInterval(() => {
        progressBar.value = period.getProgress();
        if (progressBar.value === 100) {
          clearInterval(intervalId);
        }
      }, 10000);
    }

    td.appendChild(progressBar);
    container.appendChild(td);
  });
}
