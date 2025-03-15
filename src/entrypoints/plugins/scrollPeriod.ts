export default function init() {
  defineStPlugin(
    "scrollPeriod",
    () => {
      const timetable = document.querySelector("[data-timetable-container] div.scrollable");

      if (window.location.pathname === "/" && document.getElementsByClassName("timetable")[0]) {
        updateScrollbar();
        setInterval(updateScrollbar, 10000);
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
