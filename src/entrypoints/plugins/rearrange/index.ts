export default function init() {
  defineStPlugin(
    "rearrange",
    async (_id, data) => {
      // const components = document.querySelectorAll('[id^="component"]:not(:has([id^="component"])'); // only top level components
      const components = document.querySelectorAll('[id^="component"]');

      document.querySelectorAll("#content > .row > .columns").forEach((x) => {
        x.style.border = "2px solid red";
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
        // Create a handle element and insert it at the start of the component
        const handle = document.createElement("span");
        handle.innerHTML = svg;
        handle.style.cursor = "grab";
        handle.style.display = "inline-flex";
        handle.style.alignItems = "center";
        handle.style.marginRight = "8px";
        handle.classList.add("drag-handle");
        component.insertBefore(handle, component.firstChild);

        component.setAttribute("draggable", "true"); // Make the elements draggable
        component.addEventListener("dragstart", () => {
          component.classList.add("dragging");
        });
        component.addEventListener("dragend", () => {
          component.classList.remove("dragging");
        });
        // Add dragover event listener to the parent container
        component.parentElement.addEventListener("dragover", (e) => {
          e.preventDefault();
          const afterElement = getDragAfterElement(component.parentElement, e.clientY);
          const dragging = document.querySelector(".dragging");
          // Only append or insert if the dragging element is not already a child of the parent
          if (afterElement == null) {
            if (dragging.parentElement !== component.parentElement) {
              component.parentElement.appendChild(dragging);
            }
          } else {
            if (dragging.parentElement !== afterElement.parentElement) {
              afterElement.parentElement.insertBefore(dragging, afterElement);
            }
          }
        });
      });
      function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('[id^="component"]:not(.dragging)')];
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
