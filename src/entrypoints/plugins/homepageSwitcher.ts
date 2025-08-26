export default function init() {
  defineStPlugin(
    "homepageSwitcher",
    (_id, data) => {
      const logos = Array.from(document.getElementsByClassName("logo")) as HTMLAnchorElement[];
      logos.forEach((logo) => {
        logo.addEventListener("click", async function (e) {
          if (window.location.pathname === "/") return;
          e.preventDefault();
          const tab = logos[0].href;
          const closeCurrentTab = await data.settings?.toggle?.closeCurrentTab?.toggle?.storage?.getValue();
          if (closeCurrentTab?.toggle === true) {
            browser.runtime.sendMessage({ closeTab: true });
          }
          browser.runtime.sendMessage({ toTab: tab });
        });
      });
    },
    [".logo"],
  );
}
