import pluginNext from "@next/eslint-plugin-next";
import { defineConfig } from "eslint/config";

import reactConfig from "./react.js";

export default defineConfig([
  ...reactConfig,
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
]);
