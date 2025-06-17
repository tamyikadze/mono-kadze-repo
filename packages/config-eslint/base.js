import eslint from "@eslint/js";
import turboConfig from "eslint-config-turbo/flat";
import * as depend from "eslint-plugin-depend";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  {
    files: ["src/**/*.tsx", "src/**/*.ts"],
  },
  globalIgnores([
    "**/build",
    "**/coverage",
    "**/node_modules",
    "**/postcss.config.js",
    "**/.next",
    "**/.prettierrc.js",
  ]),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-expression": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-case-declarations": "off",
    },
  },
  perfectionist.configs["recommended-natural"],
  depend.configs["flat/recommended"],

  ...turboConfig,
  eslintPluginPrettierRecommended,
  {
    ...sonarjs.configs.recommended,
    rules: {
      "sonarjs/no-nested-conditional": "warn",
      "sonarjs/todo-tag": "warn",
    },
  },
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "no-unused-vars": "off", // or "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    languageOptions: {
      globals: globals.builtin,
    },
    plugins: {
      unicorn,
    },
    rules: {
      "unicorn/better-regex": "error",
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
        },
      ],
    },
  },
]);
