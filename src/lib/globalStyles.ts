import layout from "@src/lib/layout";

import colors from "./colors";

const globalStyles = layout.NLStyleSheetCreator({
	absoluteFill: {
		position: "absolute",
		width: "100%",
		height: "100%",
	},
	fillWidth: {
		width: "100%",
	},
	fillHeight: {
		height: "100%",
	},
	centered: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
	},
	centeredSpaceBetween: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	backdropFilter: {
		backdropFilter: "blur(20px)",
	},
	firefoxBlur: {
		filter: "blur(20px)",
	},
	listNugg: {
		height: "80px",
		width: "80px",
	},
	textWhite: {
		color: "white",
	},
	textBlack: {
		color: "black",
	},
	textBlue: {
		color: colors.mainBlueText,
	},
	textRed: {
		color: colors.mainRedText,
	},
	hidden: {
		opacity: 0,
		pointerEvents: "none",
	},
	displayNone: {
		opacity: 0,
		pointerEvents: "none",
		display: "none",
	},
} as const);

export default globalStyles;
