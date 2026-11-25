import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Bewusste Ausnahme: Wir hydrieren Einstellungen und Demo-Daten nach dem
      // Mount aus localStorage (SSR-sicher). Das ist genau der Fall
      // "Subscribe to external system" — die Regel erkennt das Muster aber
      // nicht und würde sonst jede localStorage-Hydration blockieren.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
