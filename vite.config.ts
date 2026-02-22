import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // React + core runtime deps (keep together to avoid circular chunks)
          if (
            /node_modules\/(react|react-dom|scheduler|use-sync-external-store|react-is)\//.test(
              id,
            )
          ) {
            return "vendor-react";
          }

          if (
            id.includes("antd") ||
            id.includes("@ant-design") ||
            /node_modules\/rc-[^/]+\//.test(id)
          ) {
            return "vendor-antd";
          }

          if (id.includes("react-router") || id.includes("@remix-run/router")) {
            return "vendor-router";
          }

          // Let Rollup decide for the rest.
          return;
        },
      },
    },
  },
});
