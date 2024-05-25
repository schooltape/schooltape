// moves the timetable to it's own row on the dashboard, preventing it from being squished by other elements

// check if we're on the homepage and a timetable element exists
if (window.location.pathname === "/" || document.querySelector(".timetable")) {

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
