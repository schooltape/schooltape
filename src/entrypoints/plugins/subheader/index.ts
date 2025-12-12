import { dataAttr, injectInlineStyles, setDataAttr, uninjectInlineStyles } from "@/utils";
import { getCurrentPeriod } from "@/utils/periodUtils";
import { Plugin } from "@/utils/plugin";
import type { Toggle } from "@/utils/storage";
import type { StorageState } from "@/utils/storage/state.svelte";
import menu from "./Menu.svelte?url";
import styleText from "./styles.css?inline";

const ID = "subheader";
const PLUGIN_ID = `plugin-${ID}`;

let intervals: NodeJS.Timeout[] = [];
let oldChildren: ChildNode[] = [];
let subheader: HTMLHeadingElement | null = null;

export type Settings = {
  openInNewTab: StorageState<Toggle>;
};

export default new Plugin<Settings>(
  {
    id: ID,
    name: "Subheader Revamp",
    description: "Adds a clock and current period info to the subheader.",
  },
  true,
  {
    config: {
      openInNewTab: { toggle: true },
    },
    menu,
  },
  async (settings) => {
    const openInNewTab = await settings.openInNewTab.get();
    injectSubheader(openInNewTab.toggle);
  },
  uninjectSubheader,
  [".subheader", ".timetable"],
);

function injectSubheader(openInNewTab: boolean) {
  // abort if plugin is injected
  if (subheader !== null) return;

  // abort if not on homepage
  if (window.location.pathname !== "/") return;

  subheader = document.querySelector("h2.subheader");
  if (!subheader) return;

  // inject subheader styling
  injectInlineStyles(styleText, PLUGIN_ID);

  // delete all children of the subheader
  while (subheader.firstChild) {
    oldChildren.push(subheader.removeChild(subheader.firstChild));
  }

  updatePeriodSpan(openInNewTab);
  updateClockSpan();
  updateDateSpan();

  intervals = [
    setInterval(() => updatePeriodSpan(openInNewTab), 5000),
    setInterval(updateClockSpan, 1000),
    setInterval(updateDateSpan, 60000),
  ];
}

function uninjectSubheader() {
  // abort if plugin is not injected
  if (subheader === null) return;

  // abort if not on homepage
  if (window.location.pathname !== "/") return;

  // stop updating the subheader
  intervals.forEach((interval) => clearInterval(interval));

  // remove new children
  while (subheader.firstChild) {
    subheader.removeChild(subheader.firstChild);
  }

  // restore old children
  for (const child of oldChildren) {
    subheader.appendChild(child);
  }

  // uninject subheader styling
  uninjectInlineStyles(PLUGIN_ID);

  // reset variables
  intervals = [];
  oldChildren = [];
  subheader = null;
}

async function updatePeriodSpan(openInNewTab: boolean) {
  if (!subheader) return;

  const periodId = `${PLUGIN_ID}-period`;
  let periodSpan = document.querySelector<HTMLSpanElement>(`.subheader ${dataAttr(periodId)}`);

  if (!periodSpan) {
    periodSpan = document.createElement("span");
    setDataAttr(periodSpan, periodId);
    subheader.appendChild(periodSpan);
  }

  periodSpan.textContent = "";

  // set period span content
  const period = getCurrentPeriod();
  if (period) {
    const name = period.data.name || period.header.name;
    const room = period.data.room ? ` (${period.data.room})` : "";
    let periodLink = periodSpan.querySelector("a");
    if (period.data.name && period.data.link) {
      // if there's period data
      if (!periodLink) {
        periodLink = document.createElement("a");

        periodLink.target = openInNewTab ? "_blank" : "_self";
        periodSpan.appendChild(periodLink);
      }
      periodLink.href = period.data.link;
      periodLink.textContent = `${name}${room}`;
    } else {
      // if there's only the header
      periodSpan.textContent = `${name}${room}`;
      if (periodLink) {
        periodSpan.removeChild(periodLink);
      }
    }
  }
}

function updateClockSpan() {
  if (!subheader) return;

  const clockId = `${PLUGIN_ID}-clock`;
  let clockSpan = document.querySelector<HTMLSpanElement>(`.subheader ${dataAttr(clockId)}`);

  if (!clockSpan) {
    clockSpan = document.createElement("span");
    setDataAttr(clockSpan, clockId);
    subheader.appendChild(clockSpan);
  }

  // set clock span content
  const date = new Date();
  clockSpan.textContent = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function updateDateSpan() {
  if (!subheader) return;

  const dateId = `${PLUGIN_ID}-date`;
  let dateSpan = document.querySelector<HTMLSpanElement>(`.subheader ${dataAttr(dateId)}`);

  if (!dateSpan) {
    dateSpan = document.createElement("span");
    setDataAttr(dateSpan, dateId);
    subheader.appendChild(dateSpan);
  }

  // set date span content
  const date = new Date();
  dateSpan.textContent = date.toDateString();
}
