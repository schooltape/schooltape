export default defineUnlistedScript(() => {
  const timetable = document.querySelector("[data-timetable-container] div.scrollable");

  if (window.location.pathname === "/" && document.getElementsByClassName("timetable")[0]) {
    setTimeout(updateScrollbar, 500);
    setInterval(updateScrollbar, 10000);
  }

  function updateScrollbar() {
    const periodIndex = getCurrentPeriod().index;
    if (periodIndex) {
      // console.log("scrolling to period", periodIndex);
      try {
        const period = document.querySelector(`.timetable thead tr th:nth-child(${periodIndex})`);
        timetable.scroll({
          left: period.offsetLeft - 55, // 16 for perfect alignment
          behavior: "smooth", // or 'auto' to scroll instantly
        });
      } catch (error) {
        console.error("Error updating scrollbar:", error);
      }
    }
  }
});
