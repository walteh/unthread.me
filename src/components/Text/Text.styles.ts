import lib from "@src/lib";

const styles = lib.layout.NLStyleSheetCreator({
	title: {
		...lib.layout.presets.font.main.bold,
		// color: lib.colors.textColor,
	},
	text: {
		...lib.layout.presets.fontFamily.rounded,
		// color: lib.colors.textColor,
	},
	code: {
		...lib.layout.presets.fontFamily.monospace,
		// color: lib.colors.textColor,
	},
	light: {
		fontWeight: lib.layout.presets.weight.thin,
	},
	regular: {
		fontWeight: lib.layout.presets.weight.normal,
	},
	bold: {
		fontWeight: lib.layout.presets.weight.bold,
	},
	bolder: {
		fontWeight: lib.layout.presets.weight.heavy,
	},
	smallest: {
		fontSize: lib.fontSize.tiny,
	},
	smaller: {
		fontSize: lib.fontSize.p,
	},
	small: {
		fontSize: lib.fontSize.h5,
	},
	medium: {
		fontSize: lib.fontSize.h4,
	},
	large: {
		fontSize: lib.fontSize.h3,
	},
	largerish: {
		fontSize: lib.fontSize.h2_small,
	},
	larger: {
		fontSize: lib.fontSize.h2,
	},
	largermax: {
		fontSize: lib.fontSize.h2_large,
	},
	largestish: {
		fontSize: lib.fontSize.h1_small,
	},
	largest: {
		fontSize: lib.fontSize.h1,
	},
});

export default styles;
