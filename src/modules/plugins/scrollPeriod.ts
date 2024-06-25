export default defineWxtPlugin(() => {
  defineStPlugin("scrollPeriod", () => {
    const timetable = document.querySelector("[data-timetable-container] div.scrollable");

    if (window.location.pathname === "/" && document.getElementsByClassName("timetable")[0]) {
      setTimeout(updateScrollbar, 500);
      setInterval(updateScrollbar, 10000);
    }

    function updateScrollbar() {
      const currentPeriod = getCurrentPeriod();
      if (currentPeriod && currentPeriod.index && timetable) {
        const period = document.querySelector(
          `.timetable thead tr th:nth-child(${currentPeriod.index})`,
        ) as HTMLElement; // Type assertion here
        if (period) {
          // Check if period is truthy to ensure it's not null
          timetable.scroll({
            left: period.offsetLeft - 55, // Adjusted for alignment
            behavior: "smooth", // or 'auto' for instant scroll
          });
        }
      }
    }
  });
});
