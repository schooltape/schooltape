const tabTitleConsoleStyle = "color: lime; font-weight: bold;";
console.log(`%c[tab-title.js]`, tabTitleConsoleStyle, "Injected tab-title.js!");

try {
    if (document.getElementById("heading")) {
        // change the title of the tab to the value attribute of #heading
        document.title = document.getElementById("heading").getAttribute("value");
    }
} catch (error) {
}
if (window.location.pathname === "/") { // check if the current page is the homepage
    // change the title of the tab to "Homepage"
    document.title = "Homepage";
} else if (window.location.pathname === "/timetable") { // check if the current page is the timetable page
    // change the title of the tab to "Timetable"
    document.title = "Timetable";
} else if (window.location.pathname.includes("/calendar")) { // check if the current page is the calendar page
    // change the title of the tab to "Calendar"
    document.title = "Calendar";
} else if (window.location.pathname === "/news") { // check if the current page is the news page
    // change the title of the tab to "News"
    document.title = "News";
} else if (window.location.pathname === "/learning/classes") { // check if the current page is the classes page
    // change the title of the tab to "Classes"
    document.title = "Classes";
} else if (window.location.pathname.includes("/grades/")) { // check if the current page is the grades page
    // change the title of the tab to "Grades"
    document.title = "Grades";
} else if (window.location.pathname.includes("/news/")) { // check if the current page is a news page
    // change the title of the tab to "News"
    document.title = "News";
    // append the title of the news article to the title of the tab (h1)
    document.title += " (" + document.getElementsByTagName("h1")[0].innerText + ")";
} else if (window.location.pathname.includes("/assessments/")) { // check if the current page is an assessments page
    // change the title of the tab to "Assessments"
    document.title = "Assessments";
    // append the title of the assessment to the title of the tab (h1)
    document.title += " (" + document.getElementsByTagName("h1")[0].innerText + ")";
} else {
    // don't change the title of the tab
}