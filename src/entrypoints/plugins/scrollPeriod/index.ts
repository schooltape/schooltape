import { getCurrentPeriod } from "@/utils/periodUtils";
import { Plugin } from "@/utils/plugin";
import type { Slider, Toggle } from "@/utils/storage";
import type { StorageState } from "@/utils/storage/state.svelte";

let interval: NodeJS.Timeout | null = null;
let controller: AbortController | null = null;

export type Settings = {
  resetCooldownOnMouseMove: StorageState<Toggle>;
  cooldownDuration: StorageState<Slider>;
};

export default new Plugin<Settings>(
  {
    id: "scrollPeriod",
    name: "Scroll Period",
    description: "Scrolls to the current period on the timetable.",
  },
  true,
  {
    resetCooldownOnMouseMove: { toggle: true },
    cooldownDuration: { min: 1, max: 60, value: 10 },
  },
  async (settings) => {
    const timetable = document.querySelector("[data-timetable-container] div.scrollable");

    if (window.location.pathname === "/" && timetable) {
      updateScrollbar(timetable);

      const cooldownDuration = await settings.cooldownDuration.get();
      const resetCooldownOnMouseMove = await settings.resetCooldownOnMouseMove.get();

      const setUpdateInterval = () => {
        interval = setInterval(() => updateScrollbar(timetable), (cooldownDuration?.value || 10) * 1000);
      };

      setUpdateInterval();

      if (resetCooldownOnMouseMove.toggle === true) {
        controller = new AbortController();
        document.addEventListener(
          "mousemove",
          () => {
            if (interval) {
              clearInterval(interval);
              setUpdateInterval();
            }
          },
          { signal: controller.signal },
        );
      }
    }
  },
  () => {
    if (controller) {
      controller.abort();
      controller = null;
    }
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  },
  [".timetable"],
);

function updateScrollbar(timetable: Element) {
  const currentPeriod = getCurrentPeriod();
  if (currentPeriod && currentPeriod.index && timetable) {
    const period = document.querySelector(`.timetable thead tr th:nth-child(${currentPeriod.index})`) as HTMLElement;
    if (period) {
      timetable.scroll({
        left: period.offsetLeft - 55, // adjusted for alignment
        behavior: "smooth", // or 'auto' for instant scroll
      });
    }
  }
}
