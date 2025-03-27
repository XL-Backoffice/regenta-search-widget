import { defineConfig, loadEnv } from 'vite'
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return defineConfig({
    plugins: [svgr(), react()],
    server: {
      port: parseInt(process.env.VITE_PORT),
    },
    define: {
      "process.env": {},
    },
    build: {
      lib: {
        entry: "src/SearchWidget.jsx",
        name: "SearchWidget",
        fileName: (format) => `search-widget.${format}.js`,
        formats: ["umd"],
      },
      rollupOptions: {
        // Remove the external line to bundle React with your widget
        output: {
          name: "named",
        },
      },
    },
  });
})
