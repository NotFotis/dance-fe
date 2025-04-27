// eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

// necessary to get __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Next.js’s recommended web-vitals rules:
  ...compat.extends("next/core-web-vitals"),
  // Then TypeScript support:
  ...compat.extends("next/typescript"),

  // If you need to add custom rules, append another object here:
  // {
  //   rules: {
  //     "react/no-unescaped-entities": "off",
  //     "@next/next/no-img-element": "off",
  //   },
  // },
];
