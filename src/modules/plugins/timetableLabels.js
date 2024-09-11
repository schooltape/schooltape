export default defineWxtPlugin(() => {
  defineStPlugin("timetableLabels", () => {
    function inject() {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      if (window.location.pathname === "/timetable" && document.getElementsByClassName("timetable")[0]) {
        for (let i = 0; i < 7; i++) {
          document.querySelector(`.timetable > thead > tr > th:nth-child(${i + 2})`).innerHTML = days[i];
          document.querySelector(`.timetable-small > div:nth-child(${i + 1}) > h2`).innerHTML = days[i];
        }
      }
    }
    setTimeout(inject, 500);
  });
});
