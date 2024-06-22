export default async function defineWxtPlugin() {
  defineStPlugin(
    "legacy-timetable",
    () => {
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
    },
    () => {
      // uninjectLogic function goes here
      // This function should undo whatever the injectLogic function does
      logger.info("uninjectign!!!!")
    }
  );
}
