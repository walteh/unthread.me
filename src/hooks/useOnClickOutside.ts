import { RefObject, useEffect, useRef } from "react";

const useOnClickOutside = <T extends HTMLElement>(node: RefObject<T | undefined>, handler: undefined | ((e: MouseEvent) => void)) => {
	const handlerRef = useRef<undefined | ((e: MouseEvent) => void)>(handler);
	useEffect(() => {
		handlerRef.current = handler;
	}, [handler]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (node.current?.contains(e.target as Node) ?? false) {
				return;
			}
			if (handlerRef.current) handlerRef.current(e);
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [node]);
};

export const useOnTapOutside = <T extends HTMLElement>(
	node: RefObject<T | undefined>,
	handler: undefined | ((e: TouchEvent | MouseEvent | Event) => void),
) => {
	const handlerRef = useRef<undefined | ((e: TouchEvent | MouseEvent | Event) => void)>(handler);
	useEffect(() => {
		handlerRef.current = handler;
	}, [handler]);

	useEffect(() => {
		const handleTapOutside = (e: TouchEvent | MouseEvent | Event) => {
			if (node.current?.contains(e.target as Node) ?? false) {
				return;
			}
			if (handlerRef.current) handlerRef.current(e);
		};
		document.addEventListener("touchstart", handleTapOutside);
		document.addEventListener("mousedown", handleTapOutside);
		return () => {
			document.removeEventListener("mousedown", handleTapOutside);
			document.removeEventListener("touchstart", handleTapOutside);
		};
	}, [node]);
};

export default useOnClickOutside;
