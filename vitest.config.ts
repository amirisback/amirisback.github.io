import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["lib/**", "app/**", "i18n/**"],
      exclude: [
        "**/*.d.ts",
        "**/node_modules/**",
        "app/layout.tsx",
        "app/manifest.ts",
        "app/robots.ts",
        "app/sitemap.ts",
        "app/sw.ts",
        "app/[lang]/layout.tsx",
        "app/[lang]/dictionaries.ts",
        "app/favicon.ico",
        "app/globals.css"
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
