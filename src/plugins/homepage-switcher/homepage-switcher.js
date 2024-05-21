let logos = Array.from(document.getElementsByClassName("logo"));

logos.forEach((logo) => {
  logo.addEventListener("click", function (e) {
    if (window.location.pathname === "/") return;
    e.preventDefault();
    chrome.storage.local.get(["settings"], function () {
      let tab = logos[0].href;
      chrome.runtime.sendMessage({ toHomepage: tab });
    });
  });
});
