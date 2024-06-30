import { useEffect } from "react";

import { useDarkMode } from "./useDarkMode";
import useDimensions from "./useDimensions";

// if (lib.userAgent.browser.name === "Safari" || lib.userAgent.browser.name === "Mobile Safari" || lib.userAgent.browser.name === "Firefox") {
// 	/// // hack to kill the horizontal see-through lines on modern safari
// 	// tried to solve with these, but none did the trick
// 	svg.rootElement.setAttribute("width", "100%");
// 	svg.rootElement.setAttribute("image-rendering", "pixelated");
// 	svg.rootElement.setAttribute("stroke-width", "1");
// 	svg.rootElement.setAttribute("shape-rendering", "geometricPrecision");
// 	svg.rootElement.setAttribute("vector-effect", "non-scaling-stroke");
// 	svg.rootElement.setAttribute("y", ".5");
// 	svg.rootElement.setAttribute("x", ".5");
// 	svg.rootElement.setAttribute("transform", `translate(0,0)`);
// 	g.setAttribute("shape-rendering", "crispEdges");
// }

export default (): null => {
	const darkMode = useDarkMode();

	const [, isPhone] = useDimensions();
	const backgroundRadialGradientElement = document.getElementById("background-radial-gradient");

	useEffect(() => {
		if (!backgroundRadialGradientElement) {
			return;
		}

		if (isPhone) {
			backgroundRadialGradientElement.style.background = "transparent";
			return;
		}

		const lightGradient =
			"radial-gradient(153.32% 100% at 47.26% 0%, rgb(80, 144, 234, .15) 0%, rgba(80, 144, 234, 0.06) 1000%), #FFFFFF";
		const darkGradient =
			"radial-gradient(150.6% 98.22% at 48.06% 0%, rgba(80, 144, 234, .34) 0%, rgb(80, 144, 234, 0.1) 1000%), #000000";

		if (darkMode) {
			// setBackground(backgroundResetStyles);

			backgroundRadialGradientElement.style.background = darkGradient;
		} else {
			// setBackground(backgroundResetStyles);

			backgroundRadialGradientElement.style.background = lightGradient;
		}
	}, [darkMode, isPhone, backgroundRadialGradientElement]);

	return null;
};
