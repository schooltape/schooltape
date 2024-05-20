try {
  if (document.getElementById("heading")) {
    document.title = document.getElementById("heading").getAttribute("value");
  }
} catch (error) {}
if (window.location.pathname === "/") {
  document.title = "Homepage";
} else if (window.location.pathname === "/timetable") {
  document.title = "Timetable";
} else if (window.location.pathname.includes("/calendar")) {
  document.title = "Calendar";
} else if (window.location.pathname === "/news") {
  document.title = "News";
} else if (window.location.pathname === "/learning/classes") {
  document.title = "Classes";
} else if (window.location.pathname.includes("/grades/")) {
  document.title = "Grades";
} else if (window.location.pathname.includes("/news/")) {
  document.title = `News (${document.getElementsByTagName("h1")[0].innerText})`;
} else if (window.location.pathname.includes("/assessments/")) {
  document.title = `Assessments (${document.getElementsByTagName("h1")[0].innerText})`;
} else if (window.location.pathname === "/resources") {
  document.title = "Resources";
} else if (window.location.pathname === "/settings/messages") {
  document.title = "Message Settings";
} else if (window.location.pathname.includes("/mail/create")) {
  document.title = "Compose Email";
} else if (window.location.pathname.includes("/search/user")) {
  document.title = `User Profile - ${document.getElementsByTagName("h1")[0].innerText}`;
} else if (window.location.pathname === "/feedback") {
  document.title = "Support and Feedback";
} else if (window.location.pathname === "/policy") {
  document.title = "Guidelines of Use and Privacy Policy";
}
