export default async function defineWxtPlugin() {
  defineStPlugin("cmdPalette", () => {
    let sections = {
      icon_links: document.querySelectorAll("#overflow-nav a"),
      side_links: document.querySelectorAll("#side-menu a"),
      subjects: document.querySelectorAll("#side-menu-mysubjects a"),
      groups: document.querySelectorAll("#side-menu-mygroups a"),
      links: document.querySelectorAll("#side-menu-mylinks a"),
    }
    console.log(sections);
  });
}
