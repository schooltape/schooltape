export default function init() {
  definePlugin(
    "homepageSwitcher",
    (settings) => {
      const logos = Array.from(document.getElementsByClassName("logo")) as HTMLAnchorElement[];
      logos.forEach((logo) => {
        logo.addEventListener("click", async function (e) {
          if (window.location.pathname === "/") return;
          e.preventDefault();
          const tab = logos[0].href;
          if (settings?.toggle.closeCurrentTab === true) {
            window.close();
          }
          browser.runtime.sendMessage({ toTab: tab });
        });
      });
    },
    [".logo"],
  );
}
