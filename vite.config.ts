import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), basicSsl()],
	resolve: {
		alias: {
			"@src": path.resolve("src"),
		},
	},
});
