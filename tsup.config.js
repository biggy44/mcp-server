import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false, // Keep readable for debugging MCP issues
  treeshake: true,
  outDir: "dist",
  external: ["@modelcontextprotocol/sdk", "@ason-format/ason"],
  shims: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
  async onSuccess() {
    console.log("✓ MCP server built successfully");
  },
});
