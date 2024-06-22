export default defineWxtPlugin(() => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  if (window.location.pathname === "/timetable" && document.getElementsByClassName("timetable")[0]) {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          const timetable = document.querySelector(".timetable");
          const timetableSmall = document.querySelector(".timetable-small");
          if (timetable && timetableSmall) {
            observer.disconnect();
            days.forEach((day, i) => {
              document.querySelector(`.timetable > thead > tr > th:nth-child(${i + 2})`).innerHTML = day;
              document.querySelector(`.timetable-small > div:nth-child(${i + 1}) > h2`).innerHTML = day;
            });
            return;
          }
        }
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  }
});
