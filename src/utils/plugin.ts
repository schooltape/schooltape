export async function defineStPlugin<T extends StPlugin>(
  injectLogic: () => void,
  fallback: T,
  version?: number,
  migrations?: Record<number, (oldValue: any) => any>,
) {
  let plugin = await storage.getItem<T>(`local:plugin-${fallback.id}`);

  // if plugin doesn't exist, create it
  if (!plugin) {
    const x = storage.defineItem<T>(`local:plugin-${fallback.id}`, {
      fallback: fallback,
      version: version,
      migrations: migrations,
    });
    plugin = await x.getValue();
  }

  logger.info(`StPlugin: ${PLUGIN_INFO[fallback.id].name} is ${plugin.toggle ? "enabled" : "disabled"}`);

  let settings = await globalSettings.getValue();

  if (plugin && typeof window !== "undefined" && settings.urls.includes(window.location.origin)) {
    if (settings.global && settings.plugins && plugin.toggle) {
      // inject
      logger.info(`Injecting plugin: ${PLUGIN_INFO[fallback.id].name}`);
      injectLogic();
    }
  }
}
