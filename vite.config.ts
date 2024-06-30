import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), basicSsl()],

	build: {
		chunkSizeWarningLimit: 600,
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: {
					nlp: ["compromise"],
					animation: ["@react-spring/web"],
					charts: ["react-apexcharts"],
				},
			},
		},
	},
	resolve: {
		alias: {
			"@src": path.resolve("src"),
		},
	},
});
