import { defineWxtModule, addEntrypoint } from 'wxt/modules';
import { resolve } from 'node:path';

// // modules/changelog.ts


// export default defineWxtModule({
//   name: 'changelog',
//   setup(wxt) {
//     addEntrypoint(wxt, {
//       type: 'unlisted-page',
//       name: 'changelog',
//       // Point to the "modules/changelog.html" file
//       inputPath: resolve(__dirname, 'changelog.html'),
//       outputDir: wxt.config.outDir,
//       options: {},
//       skipped: false,
//     });
//   },
// });

// import { defineWxtModule, addEntrypoint } from 'wxt/modules';
// import { resolve } from 'node:path';

// // export default defineWxtModule<PluginModuleOptions>({
// //   configKey: 'analytics',
// //   setup(wxt, options) {
// //     console.log(options);
// //   },
// // });

export default defineWxtModule({
  setup(wxt) {
    addEntrypoint(wxt, {
      type: 'unlisted-script',
      name: 'plugins',
      inputPath: resolve(__dirname, 'plugins'),
      outputDir: wxt.config.outDir,
      options: {},
      skipped: false
    });
  },
});

// // Define the option types
// export interface PluginModuleOptions {
//   pluginId: string;
// }

// // Use "module augmentation" to add types for the new key
// declare module 'wxt' {
//   export interface InlineConfig {
//     analytics: PluginModuleOptions;
//   }
// }
