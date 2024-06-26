import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), basicSsl()],
	build: {
		sourcemap: true,
	},
	resolve: {
		alias: {
			"@src": path.resolve("src"),
		},
	},
});
