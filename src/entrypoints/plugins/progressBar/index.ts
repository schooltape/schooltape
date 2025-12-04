import { injectInlineStyles, schooltapeQuerySelectorAll, uninjectInlineStyles } from "@/utils";
import type { Period } from "@/utils/periodUtils";
import { getListOfPeriods } from "@/utils/periodUtils";
import { definePlugin } from "@/utils/plugin";
import styleText from "./styles.css?inline";

const ID = "progressBar";
const PLUGIN_ID = `plugin-${ID}`;

export default function init() {
  definePlugin(
    ID,
    () => {
      if (window.location.pathname === "/" && document.querySelector(".timetable")) {
        const periodList = getListOfPeriods();

        const progressRow = document.createElement("tr");
        progressRow.classList.add("progress-container");
        document.querySelector(".timetable > thead")?.insertAdjacentElement("beforeend", progressRow);

        injectInlineStyles(styleText, PLUGIN_ID);
        injectProgressBars(periodList, progressRow);
      }
    },
    () => {
      uninjectInlineStyles(PLUGIN_ID);
      uninjectProgressBars();
    },
    [".timetable"],
  );
}

function getProgressBars() {
  return schooltapeQuerySelectorAll(PLUGIN_ID);
}

function injectProgressBars(periodList: Period[], container: HTMLElement) {
  if (getProgressBars().length > 0) return;

  periodList.forEach((period) => {
    const td = document.createElement("td");
    const progressBar = document.createElement("progress");
    const progress = period.getProgress();
    progressBar.className = "progress-bar";
    progressBar.max = 100;
    progressBar.style.width = "100%";
    progressBar.value = progress;
    progressBar.dataset.schooltape = PLUGIN_ID;

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

function uninjectProgressBars() {
  getProgressBars().forEach((progressBar) => document.removeChild(progressBar));
}
