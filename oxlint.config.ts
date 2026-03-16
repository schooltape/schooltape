import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    correctness: "off",
  },
  env: {
    builtin: true,
    browser: true,
  },
  options: {
    typeAware: true,
  },
});
