const fb: StPlugin = {
  toggle: true,
  id: "legacyTimetable",
};

export default async function defineWxtPlugin() {
  defineStPlugin(() => {
    if (window.location.pathname === "/" && document.querySelector(".timetable")) {
      // get the timetable container and add the 'columns' class
      let timetableContainer = document.querySelector("[data-timetable-container]");
      if (timetableContainer) {
        timetableContainer.classList.add("columns");
        // get the row element and move the timetable container to the beginning
        let rowElement = document.querySelector(".Component_Dashboard_TimetableController")?.parentNode?.parentNode;
        if (rowElement) {
          rowElement.insertBefore(timetableContainer, rowElement.firstChild);
        }
      }
    }
  }, fb);
}
