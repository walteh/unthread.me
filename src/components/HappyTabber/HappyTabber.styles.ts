import lib from "@src/lib";

const styles = lib.layout.NLStyleSheetCreator({
	wrapperContainer: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "start",
		alignItems: "center",
	},
	wrapperMobile: {
		flexDirection: "column-reverse",
	},
	header: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		borderRadius: lib.layout.borderRadius.medium,
		height: "44px",
		padding: "4px",
		width: "100%",
		flexDirection: "row",
	},
	headerTextContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		cursor: "pointer",
		zIndex: 5,
	},
	headerTextBold: {
		...lib.layout.presets.font.main.bold,
	},
	headerText: {
		...lib.layout.presets.font.main.regular,
	},
	headerTextMobile: {
		...lib.layout.presets.font.main.regular,
		textShadow: `0 0 20px ${lib.colors.textColor}`,
	},
	body: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		color: "black",
		width: "100%",
		height: "100%",
		position: "relative",
		overflow: "scroll",
	},
	item: {
		position: "absolute",
	},
	activeButton: {
		// background: lib.colors.gradient,
		color: "white",
	},
	wrapper: {
		padding: "1rem",
		width: "100%",
		height: "100%",
	},
	selectionIndicator: {
		height: "34px",
		position: "absolute",
		zIndex: 4,
		// backgroundColor: 'rgba(80, 144, 234, 0.4)',
		background: lib.colors.transparentWhite,
		borderRadius: lib.layout.borderRadius.mediumish,
		...lib.globalStyles.backdropFilter,
	},
});

export default styles;
