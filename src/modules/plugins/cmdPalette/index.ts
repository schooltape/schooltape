import html from './index.html?raw';
import App from "./App.svelte";

export default async function defineWxtPlugin() {
  document.addEventListener('DOMContentLoaded', (event) => {
    defineStPlugin("cmdPalette", () => {
      let sections = {
        icon_links: document.querySelectorAll("#overflow-nav a"),
        side_links: document.querySelectorAll("#side-menu a"),
        subjects: document.querySelectorAll("#side-menu-mysubjects a"),
        groups: document.querySelectorAll("#side-menu-mygroups a"),
        links: document.querySelectorAll("#side-menu-mylinks a"),
      }
      console.log(sections);

      document.body.insertAdjacentHTML('beforeend', html);
      new App({
        target: document.getElementById("command-palette")!,
      });
    });
  });
}
