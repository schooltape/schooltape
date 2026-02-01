import { defineAppConfig, storage } from "#imports";
import { umami } from "@wxt-dev/analytics/providers/umami";

export default defineAppConfig({
  analytics: {
    debug: true,
    enabled: storage.defineItem("local:analytics-enabled", {
      fallback: true,
    }),
    userId: storage.defineItem<string>("local:analytics-id", {
      init: () => crypto.randomUUID(),
    }),
    providers: [
      umami({
        apiUrl: "https://cloud.umami.is/api",
        websiteId: import.meta.env.WXT_UMAMI_WEBSITE_ID,
        domain: import.meta.env.WXT_UMAMI_DOMAIN,
      }),
    ],
  },
});
