export default function init() {
  definePlugin(
    "homepageSwitcher",
    (_id, data, settings) => {
      const logos = Array.from(document.getElementsByClassName("logo")) as HTMLAnchorElement[];
      logos.forEach((logo) => {
        logo.addEventListener("click", async function (e) {
          if (window.location.pathname === "/") return;
          e.preventDefault();
          const tab = logos[0].href;
          const closeCurrentTab = await settings?.closeCurrentTab.state.storage.getValue();
          if (closeCurrentTab?.toggle === true) {
            window.close();
          }
          browser.runtime.sendMessage({ toTab: tab });
        });
      });
    },
    [".logo"],
  );
}
