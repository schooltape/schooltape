import { getCurrentPeriod } from "@/utils/periodUtils";
import { definePlugin } from "@/utils/plugin";

let interval: NodeJS.Timeout | null = null;
let controller: AbortController | null = null;

export default function init() {
  definePlugin(
    "scrollPeriod",
    async (settings) => {
      const timetable = document.querySelector("[data-timetable-container] div.scrollable");

      if (window.location.pathname === "/" && timetable) {
        updateScrollbar(timetable);

        const cooldownDuration = settings?.slider.cooldownDuration;
        const resetCooldownOnMouseMove = settings?.toggle.resetCooldownOnMouseMove;

        const setUpdateInterval = () => {
          interval = setInterval(() => updateScrollbar(timetable), (cooldownDuration?.value || 10) * 1000);
        };

        setUpdateInterval();

        if (resetCooldownOnMouseMove === true) {
          controller = new AbortController();
          document.addEventListener(
            "mousemove",
            () => {
              if (interval) {
                clearInterval(interval);
                setUpdateInterval();
              }
            },
            { signal: controller.signal },
          );
        }
      }
    },
    () => {
      if (controller) {
        controller.abort();
        controller = null;
      }
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    },
    [".timetable"],
  );
}

function updateScrollbar(timetable: Element) {
  const currentPeriod = getCurrentPeriod();
  if (currentPeriod && currentPeriod.index && timetable) {
    const period = document.querySelector(`.timetable thead tr th:nth-child(${currentPeriod.index})`) as HTMLElement;
    if (period) {
      timetable.scroll({
        left: period.offsetLeft - 55, // adjusted for alignment
        behavior: "smooth", // or 'auto' for instant scroll
      });
    }
  }
}
