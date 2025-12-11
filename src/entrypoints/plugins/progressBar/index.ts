import { dataAttr, injectInlineStyles, setDataAttr, uninjectInlineStyles } from "@/utils";
import type { Period } from "@/utils/periodUtils";
import { getListOfPeriods } from "@/utils/periodUtils";
import { Plugin } from "@/utils/plugin";
import styleText from "./styles.css?inline";

const ID = "progressBar";
const PLUGIN_ID = `plugin-${ID}`;

export default new Plugin(
  {
    id: ID,
    name: "Progress Bar",
    description: "Displays a progress bar below the timetable to show the time of the day.",
  },
  {
    toggle: true,
  },
  () => {
    if (window.location.pathname === "/" && document.querySelector(".timetable")) {
      const periodList = getListOfPeriods();

      const progressRow = document.createElement("tr");
      progressRow.classList.add("progress-container");
      document.querySelector(".timetable > thead")?.insertAdjacentElement("beforeend", progressRow);

      injectInlineStyles(styleText, PLUGIN_ID);
      injectProgressBars(periodList, progressRow);

      setDataAttr(progressRow, `${PLUGIN_ID}-row`);
    }
  },
  () => {
    uninjectInlineStyles(PLUGIN_ID);
    uninjectProgressBars();
  },
  [".timetable"],
);

function injectProgressBars(periodList: Period[], container: HTMLElement) {
  if (document.querySelector(dataAttr(`${PLUGIN_ID}-row`))) return;

  for (const period of periodList) {
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
  }
}

function uninjectProgressBars() {
  const row = document.querySelector(dataAttr(`${PLUGIN_ID}-row`));
  row?.parentElement?.removeChild(row);
}
