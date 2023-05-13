const SpecificTabTitles = "color: aqua; font-weight: bold;";
console.log(`%c[tab-titles-specific.js]`, SpecificTabTitles, "Injected tab-titles-specific.js!");

if (window.location.pathname === "/modules/remote/aHR0cHM6Ly9hcHAuZWRzbWFydC5jb20vc2Nob29sYm94U1NPLz9DdXN0b21lcklkPTI0ODQ5NDQ3") { // check if the current page is the forms page
    // change the title of the tab to "Forms"
    document.title = "Forms";

} else if (window.location.pathname === "/resources") { // check if the current page is the resources page
    // change the title of the tab to "Resources"
    document.title = "Resources";

} else if (window.location.pathname === "/settings/messages") { // check if the current page is the settings page
    // change the title of the tab to "Message Settings"
    document.title = "Message Settings";

} else if (window.location.pathname.includes("/mail/create")) { // check if the current page is the compose email page
    // change the title of the tab to "Compose Email"
    document.title = "Compose Email";

} else if (window.location.pathname.includes("/search/user")) { // check if the current page is a user profile page
    // change the title of the tab to "User Profile"
    document.title = "User Profile";
    // append the name of the current profile to the title of the tab (h1)
    document.title += " – " + document.getElementsByTagName("h1")[0].innerText;

} else {
    // Do nothing
}