import tailwindcss from "tailwindcss";

// const fonts: tailwindcss.Fonts = {};

const config: tailwindcss.Config = {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		// "./node_modules/flowbite/**/*.js", "node_modules/preline/dist/*.js"
	],
	theme: {
		extend: {
			fontFamily: {
				// '"SF Mono", SFMono-Regular, ui-monospace,"DejaVu Sans Mono", Menlo, Consolas, monospace',

				mono: ["SF Mono", "ui-monospace", "SFMono-Regular", "DejaVu Sans Mono", "Menlo", "Consolas", "monospace"],
				// 				'SFRounded, ui-rounded, "SF Pro Rounded", system-ui, "Helvetica Neue", Arial, Helvetica, sans-serif',

				rounded: [
					'"SF Rounded"',
					"ui-rounded",
					"SF Pro Rounded",
					"system-ui",
					"Helvetica Neue",
					"Arial",
					"Helvetica",
					"sans-serif",
				],
				sans: ['"SF Pro"', "ui-sans-serif", "SF, system-ui", "Helvetica Neue", "Arial", "Helvetica", "sans-serif"],
				// 'SF, ui-sans-serif, "SF Pro", system-ui, "Helvetica Neue", Arial, Helvetica, sans-serif',
				// apple default
				// sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
			},
		},
	},
	plugins: [
		// require("daisyui"),
		// require("flowbite/plugin")({
		// 	charts: true,
		// }),
		// require("preline/plugin"),
		require("@tailwindcss/forms"),
	],
};

export default config;
