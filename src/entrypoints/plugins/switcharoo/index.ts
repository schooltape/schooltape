import styleText from "./styles.css?inline";

export default function init() {
  defineStPlugin("switcharoo", async () => {
    const footer = document.getElementById("footer");
    const toast = document.getElementById("toast");
    if (toast) {
      toast.style.display = "none";
    }
    const content = document.getElementById("content");
    if (content) {
      const title = content.getElementsByClassName("Component_Dashboard_GreetingController");
      content.appendChild(title[0]);
      const notiwork = document.createElement("div");
      content.appendChild(notiwork);
      notiwork.style.display = "flex";
      notiwork.style.flexDirection = "row";
      notiwork.style.justifyContent = "space-between";
      const notices = document.getElementsByClassName("Schoolbox_Comms_News_Component_Dashboard_Controller");
      notiwork.appendChild(notices[0]);
      const duework = document.getElementsByClassName("Schoolbox_Learning_Component_Dashboard_UpcomingWorkController");
      notiwork.appendChild(duework[0]);
      const quickLinksDivider = document.createElement("tr");
      quickLinksDivider.style.width = "100%";
      quickLinksDivider.style.height = "5px";
      quickLinksDivider.style.margin = "25px 0";
      quickLinksDivider.style.borderRadius = "5px";
      quickLinksDivider.style.backgroundColor = "hsl(var(--ctp-overlay2))"
      content.appendChild(quickLinksDivider);
      const quickLinksContainer = document.createElement("div");
      content.appendChild(quickLinksContainer);
      quickLinksContainer.style.display = "flex";
      quickLinksContainer.style.flexDirection = "row";
      quickLinksContainer.style.justifyContent = "space-evenly";
      content.querySelectorAll(".Schoolbox_Tile_Component_DashboardTileController").forEach((container) => {
        const htmlcontainer = container as HTMLElement;
        htmlcontainer.style.width = "100%";
        quickLinksContainer.appendChild(container);
      });
      if (footer) {
        content.appendChild(footer);
      }
      injectStyles(styleText);
    } else {
      logger.error("Could not find content element");
    }
  });
}