import lib from "@src/lib";

const styles = lib.layout.NLStyleSheetCreator({
	button: {
		background: lib.colors.secondaryColor,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: lib.layout.borderRadius.small,
		flexDirection: "row",
		padding: ".5rem 1rem",
		cursor: "pointer",
		color: "black",
		transition: `all .2s ${lib.layout.animation}`,
	},
	text: {
		margin: 0,
	},
});

export default styles;
