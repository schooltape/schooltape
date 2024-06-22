export async function defineStPlugin(pluginName: string, injectLogic: () => void, uninjectLogic: () => void) {
  let settings = await globalSettings.getValue();
  let plugins = await pluginSettings.getValue();
  // add listener for uninjectLogic with settings change
  // browser.runtime.onConnect.addListener((port) => {
  //   if (port.name === 'plugins') {
  //     port.onMessage.addListener((message) => {
  //       console.log('Plugin recieved:', message);
  //       if (!message.global || !message.plugins.includes(pluginName)) {
  //         console.log("plugins windowlocorigin: ", window.location.origin);
  //         // uninjectStuff();
  //       }
  //     });
  //   }
  //   if (port.name === 'global') {
  //     port.onMessage.addListener((message) => {
  //       console.log('Plugin recieved:', message);
  //       if (!message.global) {
  //         console.log("global windowlocorigin: ", window.location.origin);
  //         // uninjectStuff();
  //       }
  //     });
  //   }
  // });
  load();

  pluginSettings.watch(async (newSettings, oldSettings) => {
    plugins = newSettings;
    if (newSettings.enabled.includes(pluginName) === !oldSettings.enabled.includes(pluginName)) {
      console.log("load func called");
      load();
    }
  });

  function load() {
    if (settings.urls.includes(window.location.origin)) {
      if (
        settings.global &&
        plugins.toggle &&
        plugins.enabled.includes(pluginName)
      ) {
        // inject
        logger.info(`Injecting plugin: ${pluginName}`);
        injectLogic();
      } else {
        console.log("plugin is disabled: ", pluginName);
        // uninject
        // this function should undo whatever the injectLogic function does
        // logger.info(`Uninjecting plugin: ${pluginName}`);
        uninjectLogic();
      }
    }
  }
}
