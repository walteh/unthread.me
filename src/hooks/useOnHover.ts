import { RefCallback, useEffect, useRef, useState } from "react";

import useDimensions from "@src/client/hooks/useDimensions";

const useOnHover = (callback?: RefCallback<unknown>): [React.RefObject<HTMLDivElement>, boolean] => {
	const ref = useRef<HTMLDivElement>(null);
	const [isHovering, setIsHovering] = useState(false);

	const [screen] = useDimensions();

	useEffect(() => {
		if (screen === "desktop" && ref.current) {
			const { current } = ref;
			const enter = () => {
				setIsHovering(true);
			};
			const leave = () => {
				setIsHovering(false);
			};
			current.onmouseenter = () => {
				setIsHovering(true);
			};
			current.onmousemove = () => {
				setIsHovering(true);
			};
			current.onmouseover = () => {
				setIsHovering(true);
			};
			current.onmouseleave = () => {
				setIsHovering(false);
			};
			current.addEventListener("mouseenter", enter);
			current.addEventListener("mouseover", enter);
			current.addEventListener("mousemove", enter);
			current.addEventListener("mouseleave", leave);
			return () => {
				current.removeEventListener("mouseenter", enter);
				current.removeEventListener("mouseover", enter);
				current.removeEventListener("mousemove", enter);
				current.removeEventListener("mouseleave", leave);
			};
		}
		setIsHovering(false);
		return () => undefined;
	}, [ref, screen]);

	useEffect(() => {
		if (callback) callback(isHovering);
	}, [isHovering, callback]);

	return [ref, isHovering];
};

export default useOnHover;
