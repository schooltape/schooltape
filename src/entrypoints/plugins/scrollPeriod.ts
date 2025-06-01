export default function init() {
  defineStPlugin(
    "scrollPeriod",
    async (_id, storage) => {
      const timetable = document.querySelector("[data-timetable-container] div.scrollable");

      if (window.location.pathname === "/" && document.getElementsByClassName("timetable")[0]) {
        updateScrollbar();
        const settings = (await storage.getValue()).settings;

        let interval: string | number | NodeJS.Timeout | undefined;
        function start() {
          interval = setInterval(updateScrollbar, settings?.slider?.cooldownDuration.value);
        }
        function reset() {
          if (interval) {
            clearInterval(interval);
          }
        }

        start();

        if (settings?.toggle?.resetCooldownOnMouseMove.toggle === true) {
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
