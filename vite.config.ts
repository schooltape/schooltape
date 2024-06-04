import { defineConfig } from "vite";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";
// import copy from 'rollup-plugin-copy';
import path from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// const APPID_CHROME = '';
const browser = process.env.TARGET || "chrome";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    svelte(),
    webExtension({
      manifest: generateManifest,
      browser: process.env.TARGET || "chrome",
      watchFilePaths: ["package.json", "manifest.json"],
    }),
    // copy({
    //   targets: [
    //     { src: 'src/options', dest: 'dist/src/options' },
    //   ],
    // }),
  ],
  build: {
    assetsInlineLimit: 1024,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name?.split(".").at(1) || "";
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = "icons";
          }
          return `src/assets/${extType}/[name][extname]`;
        },
      },
    },

    emptyOutDir: true,
    // sourcemap: mode === 'development' ? 'inline' : false,
    minify: mode === "development" ? false : true,
  },
  define: {
    "process.env": process.env,
    __EXTENSION_MODE__: JSON.stringify(mode),
    __DEV__: mode === "development",
    __PROD__: mode === "production",
    // __APP_ID__: JSON.stringify(APPID_CHROME),
    __BROWSER__: JSON.stringify(browser),
  },
  // pre-bundle webextension-polyfill
  optimizeDeps: {
    include: ["webextension-polyfill"],
  },
}));
