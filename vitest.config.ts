import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "#site/content": path.resolve(__dirname, ".velite"),
    },
  },
  test: {
    include: ["src/**/__tests__/**/*.test.ts", "scripts/__tests__/**/*.test.ts"],
  },
});
