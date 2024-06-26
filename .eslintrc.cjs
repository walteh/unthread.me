module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/strict-type-checked",
		"plugin:react-hooks/recommended",
		"plugin:@typescript-eslint/stylistic-type-checked",
		"plugin:react/recommended",
		"plugin:react/jsx-runtime",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@typescript-eslint/parser",
	plugins: ["react-refresh", "unused-imports", "simple-import-sort", "import"],
	rules: {
		"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
		"no-undef": "off",
		"@typescript-eslint/restrict-template-expressions": "off",
		"unused-imports/no-unused-imports": "error",
		"simple-import-sort/imports": [
			2,
			{
				groups: [
					// Side effect imports.
					["^\\u0000"],
					// Node.js builtins prefixed with `node:`.
					["^bun:"],
					// Packages.
					// Things that start with a letter (or digit or underscore), or `@` followed by a letter.
					["^@?\\w"],
					// Absolute imports and other imports such as Vue-style `@/foo`.
					// Anything not matched in another group.
					["^"],
					["^@src"],
					// Relative imports.
					// Anything that starts with a dot.
					["^\\."],
				],
			},
		],

		"simple-import-sort/exports": "error",
		"import/first": "error",
		"import/newline-after-import": "error",
		"import/no-duplicates": "error",
	},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.json", "./tsconfig.node.json", "./tsconfig.app.json"],
		tsconfigRootDir: __dirname,
	},
	settings: {
		"import/resolver": {
			vite: {
				viteConfig: {
					resolve: {
						alias: {
							"@src": require("path").resolve("src"),
						},
					},
				},
			},
		},
	},
};
