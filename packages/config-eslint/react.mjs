import reactCompiler from "eslint-plugin-react-compiler";
import { defineConfig } from "eslint/config";

import baseConfig from "./base.mjs";

export default defineConfig([...baseConfig, reactCompiler.configs.recommended]);
