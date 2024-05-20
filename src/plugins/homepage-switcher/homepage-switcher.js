for (let i = 0; i < document.getElementsByClassName("logo").length; i++) {
  let logo = document.getElementsByClassName("logo")[i];
  logo.addEventListener("click", function (e) {
    e.preventDefault(); // Prevents the default action of the link
    chrome.storage.local.get(["settings"], function () {
      let tab = document.getElementsByClassName("logo")[0].href;
      chrome.runtime.sendMessage({ toHomepage: tab }, function (response) {});
    });
  });
}
