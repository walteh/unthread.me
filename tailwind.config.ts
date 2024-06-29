/** @type {import('tailwindcss').Config} */

export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		// "./node_modules/flowbite/**/*.js", "node_modules/preline/dist/*.js"
	],
	theme: {
		extend: {},
	},
	plugins: [
		// require("daisyui"),
		// require("flowbite/plugin")({
		// 	charts: true,
		// }),
		// require("preline/plugin"),
	],
};
