import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  {
    plugins: {
      import: importPlugin,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"]),
]);

export default eslintConfig;
