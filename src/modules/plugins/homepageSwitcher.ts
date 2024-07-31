import { forEachChild } from "typescript";

export default async function defineWxtPlugin() {
  defineStPlugin("homepageSwitcher", () => {
    // Select all relevant links and convert to an array of HTMLAnchorElement
    let logos = Array.from(document.getElementsByClassName("logo")) as HTMLAnchorElement[];
    let timetableLinks = Array.from(document.querySelectorAll(".timetable-subject > a")) as HTMLAnchorElement[];
    let topLinks = Array.from(document.querySelectorAll(".top-menu > li > a")) as HTMLAnchorElement[];
    let sideLinks = Array.from(document.querySelectorAll(".second-nav > li > a")) as HTMLAnchorElement[];
    let vCardLinks = Array.from(document.querySelectorAll(".v-card > a")) as HTMLAnchorElement[];
    let tileLinks = Array.from(document.querySelectorAll(".tile > a")) as HTMLAnchorElement[];
    let breadLinks = Array.from(document.querySelectorAll(".breadcrumbs > li > a")) as HTMLAnchorElement[];
    let infoLinks = Array.from(document.querySelectorAll(".list-item > div > h3 > a")) as HTMLAnchorElement[];
  
    // Combine all links into one array
    let allLinks = [...logos, ...timetableLinks, ...topLinks, ...sideLinks, ...vCardLinks, ...tileLinks, ...breadLinks, ...infoLinks];

    // Define a common click event handler
    function handleClick(e: Event) {
      e.preventDefault();
      let target = e.currentTarget as HTMLAnchorElement;
      let tab = target.href;
      browser.runtime.sendMessage({ toTab: tab });
    }

    // Add click event listener to all links
    allLinks.forEach((link) => {
      link.addEventListener("click", handleClick);
    });
  });
}
