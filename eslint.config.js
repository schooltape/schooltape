import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import path from "node:path";
import ts from "typescript-eslint";
import wxtAutoImports from "./.wxt/eslint-auto-imports.mjs";

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
    plugins: {
      import: importPlugin,
    },
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
      ...importPlugin.configs.recommended.rules,
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "import/no-cycle": "error",
      "import/no-unresolved": "off",
    },
  },
);
