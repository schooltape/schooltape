import { browser } from "#imports";
import { Plugin } from "@/utils/plugin";
import type { Toggle } from "@/utils/storage";
import type { StorageState } from "@/utils/storage/state.svelte";

const ID = "betterNotifications";

export type Settings = {
  scrapeNotifications: StorageState<Toggle>;
};

export default new Plugin<Settings>(
  {
    id: ID,
    name: "Better Notifications",
    description: "TODO: description",
  },
  true,
  {
    scrapeNotifications: { toggle: true },
  },
  async () => {
    // need to replace entire container becuase it gets reset when the websocket updates
    const messageList = document.getElementById("msg-content")?.parentElement;

    // clear existing notifications
    messageList?.replaceChildren();

    if (messageList) {
      parseNotificationsPage(await getNotificationsPage()).forEach((notification) => {
        messageList.appendChild(notification);
      });
    }
  },
  () => {},
);

async function getPhpSessionId(): Promise<string> {
  const response = await browser.runtime.sendMessage({
    type: "getCookie",
    name: "PHPSESSID",
    url: document.location.origin,
  });
  console.log("getPHPSESSID response:", response);
  return response ?? "not found";
}

async function getNotificationsPage() {
  const response = await fetch("/notifications", {
    headers: {
      Cookie: `PHPSESSID=${await getPhpSessionId()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch notifications page");
  }

  return await response.text();
}

function parseNotificationsPage(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const notifications = doc.querySelectorAll(".information-list > .row");

  return notifications;
}
