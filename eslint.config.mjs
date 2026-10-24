import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "**/.studio-patch-backups/**",
    "**/.smoothness-v1-backup/**",
    "**/.performance-v2-backup/**",
    "**/.lint-final-backup/**",
    "**/.font-optimization-backup/**",
    "**/.image-optimization-backup/**",
    "**/*.before-*.bak",
    "**/*.before-*",
    "**/*.bak",
  ]),
]);

export default eslintConfig;
