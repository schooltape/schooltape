export default defineUnlistedScript(() => {
  let logos = Array.from(document.getElementsByClassName("logo"));

  logos.forEach((logo) => {
    logo.addEventListener("click", async function (e) {
      if (window.location.pathname === "/") return;
      e.preventDefault();
      let tab = logos[0].href;
      browser.runtime.sendMessage({ toTab: tab });
    });
  });
});
