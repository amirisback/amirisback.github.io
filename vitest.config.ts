import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "cli/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", ".asample/**", "build/**", "out/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**"],
      exclude: [
        "**/*.d.ts",
        "**/node_modules/**",
        "src/app/layout.tsx",
        "src/app/manifest.ts",
        "src/app/robots.ts",
        "src/app/sitemap.ts",
        "src/app/sw.ts",
        "src/app/favicon.ico",
        "src/app/globals.css",
        "src/lib/dictionaries.ts",
        "src/dictionaries/**",
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
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
