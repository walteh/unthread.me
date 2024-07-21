import tailwindcss from "tailwindcss";

// const fonts: tailwindcss.Fonts = {};

const config: tailwindcss.Config = {
	// darkMode: "class",
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		// "./node_modules/flowbite/**/*.js", "node_modules/preline/dist/*.js"
	],
	theme: {
		future: {
			hoverOnlyWhenSupported: true,
		},
		extend: {
			fontFamily: {
				mono: ["SF Mono", "ui-monospace", "SFMono-Regular", "DejaVu Sans Mono", "Menlo", "Consolas", "monospace"],
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
			},
		},
	},
	variants: {
		extend: {
			display: ["group-hover"],
		},
	},
	plugins: [
		// require("daisyui"),
		// require("flowbite/plugin")({
		// 	charts: true,
		// }),
		// require("preline/plugin"),
		require("@tailwindcss/forms"),
		// require("nightwind"),
		require("@tailwindcss/typography"),
	],
	// typography
};

export default config;
