import { CSSProperties } from "react";

import useDimensions from "@src/client/hooks/useDimensions";
import lib from "@src/lib";

const styles = lib.layout.NLStyleSheetCreator({
	wrapper: {
		position: "absolute",
		width: "100%",
		height: "100%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",

		background: "transparent",
		backdropFilter: "blur(10px)",
		// @danny7even this seemed to cause problems with issue #67 - but it didnt solve any
		WebkitBackdropFilter: "blur(10px)",
		overflow: "hidden",
		zIndex: 999,
		transition: `opacity .5s ${lib.layout.animation}`,
	},
	mobile: {},
});

const useAnimateOverlay = (isOpen: boolean, style?: CSSProperties) => {
	const [screenType] = useDimensions();
	const wrapperStyle: Partial<CSSProperties> = {
		...styles.wrapper,
		opacity: isOpen ? 1 : 0,
		pointerEvents: isOpen ? ("auto" as const) : ("none" as const),
		...(screenType === "phone"
			? {
					justifyContent: "center",
					alignItems: "flex-start",
				}
			: {
					justifyContent: "center",
					alignItems: "center",
				}),
		...style,
	};
	return wrapperStyle;
};

export default useAnimateOverlay;
