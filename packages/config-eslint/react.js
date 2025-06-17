import reactCompiler from "eslint-plugin-react-compiler";
import { defineConfig } from "eslint/config";

import baseConfig from "./base.js";

export default defineConfig([...baseConfig, reactCompiler.configs.recommended]);
