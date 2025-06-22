import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import wxtAutoImports from "./.wxt/eslint-auto-imports.mjs";

import globals from "globals";
import { includeIgnoreFile } from "@eslint/compat";
import path from "node:path";

const gitignorePath = path.resolve(import.meta.dirname, ".gitignore");

export default ts.config(
  js.configs.recommended,
  // ...ts.configs.recommendedTypeChecked,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,

  includeIgnoreFile(gitignorePath),
  wxtAutoImports,
  { ignores: ["*.d.ts", "tailwind.config.js"] },

  // {
  //   files: ["**/*.js"],
  //   extends: [ts.configs.disableTypeChecked],
  // },
  {
    languageOptions: {
      parserOptions: {
        // projectService: {
        //   allowDefaultProject: ["*.js"],
        // },
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
      },
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
