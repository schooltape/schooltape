export default async function defineWxtPlugin() {
  defineStPlugin("smartLinks", () => {
    let links = document.querySelectorAll("a");

    // click event handler
    async function handleClick(e: Event) {
      e.preventDefault();
      let target = e.currentTarget as HTMLAnchorElement;
      let tab = target.href;
      if (!tab) return;
      // check if link is a Schoolbox URL
      let schoolboxURLs = (await globalSettings.getValue()).urls;
      if (!schoolboxURLs.some((url) => tab.startsWith(url))) {
        // do default action if not a Schoolbox URL
        return window.open(tab, target.target);
      }
      browser.runtime.sendMessage({ toTab: tab });
    }

    links.forEach((link) => {
      link.addEventListener("click", handleClick);
    });
  });
}
