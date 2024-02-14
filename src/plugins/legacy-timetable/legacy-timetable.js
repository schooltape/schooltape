/*
For developers:
Please read the Contributing guidelines here --> https://github.com/schooltape/schooltape/blob/main/CONTRIBUTING.md
*/

// If window pathname is "/" and the element with the class "timetable" exists, run the code
if (window.location.pathname === "/" && document.getElementsByClassName("timetable")[0]) {
    var timetableContainer = document.querySelectorAll("[data-timetable-container]");

    // Add the class "columns" to timetableContainer
    timetableContainer[0].classList.add("columns");

    var rowElement = document.getElementsByClassName("Component_Dashboard_TimetableController")[0].parentNode.parentNode

    // Move timetableContainer to the start of the row
    rowElement.insertBefore(timetableContainer[0], rowElement.firstChild);
}