export default function init() {
  defineStPlugin(
    "rearrange",
    async (_id, data) => {
      // Select only top-level components (not nested inside another component)
      const components = document.querySelectorAll('#content > .row > .columns > [id^="component"]');

      document.querySelectorAll("#content > .row > .columns").forEach((container) => {
        container.style.border = "2px solid red";

        // Attach dragover only to the container, not to each component
        container.addEventListener("dragover", (e) => {
          e.preventDefault();
          const dragging = document.querySelector(".dragging");
          // Only allow drop if dragging is a direct child of this container
          if (dragging && dragging.parentElement === container) {
            const afterElement = getDragAfterElement(container, e.clientY);
            if (afterElement == null) {
              container.appendChild(dragging);
            } else {
              container.insertBefore(dragging, afterElement);
            }
          }
        });
      });

      document.querySelectorAll("#content > .row").forEach((x) => {
        x.style.border = "4px solid green";
      });

      components.forEach((component) => {
        component.style.border = "2px solid hsl(var(--ctp-accent))";
        component.style.borderRadius = "8px";
        component.style.overflow = "clip";

        // add a handle
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-grip-vertical-icon lucide-grip-vertical"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>`;
        const handle = document.createElement("span");
        handle.innerHTML = svg;
        handle.style.cursor = "grab";
        handle.style.display = "inline-flex";
        handle.style.alignItems = "center";
        handle.style.marginRight = "8px";
        handle.classList.add("drag-handle");
        component.insertBefore(handle, component.firstChild);

        component.setAttribute("draggable", "true");
        component.addEventListener("dragstart", () => {
          component.classList.add("dragging");
          component.style.visibility = "hidden";
        });
        component.addEventListener("dragend", () => {
          component.classList.remove("dragging");
          component.style.visibility = "visible";
        });
      });

      function getDragAfterElement(container, y) {
        // Only consider direct children of the container, not nested components
        const draggableElements = [...container.querySelectorAll(':scope > [id^="component"]:not(.dragging)')];
        return draggableElements.reduce(
          (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
              return { offset: offset, element: child };
            } else {
              return closest;
            }
          },
          { offset: Number.NEGATIVE_INFINITY },
        ).element;
      }
    },
    ["[id^='component']"],
  );
}
