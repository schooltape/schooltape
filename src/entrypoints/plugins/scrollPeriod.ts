import { getCurrentPeriod } from "@/utils/periodUtils";
import { definePlugin } from "@/utils/plugin";

export default function init() {
  definePlugin(
    "scrollPeriod",
    async (_id, _data, settings) => {
      const timetable = document.querySelector("[data-timetable-container] div.scrollable");

      if (window.location.pathname === "/" && document.getElementsByClassName("timetable")[0]) {
        updateScrollbar();

        const cooldownDuration = settings?.slider.cooldownDuration;
        const resetCooldownOnMouseMove = settings?.toggle.resetCooldownOnMouseMove;

        let interval: string | number | NodeJS.Timeout | undefined;
        function start() {
          interval = setInterval(updateScrollbar, (cooldownDuration?.value || 10) * 1000);
        }
        function reset() {
          if (interval) {
            clearInterval(interval);
            start();
          }
        }

        start();

        if (resetCooldownOnMouseMove === true) {
          document.addEventListener("mousemove", reset);
        }
      }

      function updateScrollbar() {
        const currentPeriod = getCurrentPeriod();
        if (currentPeriod && currentPeriod.index && timetable) {
          const period = document.querySelector(
            `.timetable thead tr th:nth-child(${currentPeriod.index})`,
          ) as HTMLElement;
          if (period) {
            timetable.scroll({
              left: period.offsetLeft - 55, // adjusted for alignment
              behavior: "smooth", // or 'auto' for instant scroll
            });
          }
        }
      }
    },
    [".timetable"],
  );
}
