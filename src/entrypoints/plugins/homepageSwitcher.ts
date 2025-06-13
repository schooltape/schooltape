export default function init() {
  defineStPlugin(
    "homepageSwitcher",
    (_id, storage) => {
      const logos = Array.from(document.getElementsByClassName("logo")) as HTMLAnchorElement[];
      logos.forEach((logo) => {
        logo.addEventListener("click", async function (e) {
          if (window.location.pathname === "/") return;
          e.preventDefault();
          const tab = logos[0].href;
          const settings = (await storage.getValue()).settings;
          if (settings?.toggle?.closeCurrentTabOnSwitch.toggle === true) {
            window.close();
          }
          browser.runtime.sendMessage({ toTab: tab });
        });
      });
    },
    [".logo"],
  );
}
