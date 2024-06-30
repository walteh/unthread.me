import { useMemo } from "react";

import useSessionStore from "./useSessionStore";

export default () => {
	const dim = useSessionStore((state) => state.dimentions);

	const [screen, isPhone] = useMemo(() => {
		const res = dim.width > 1300 ? ("desktop" as const) : dim.width > 750 ? ("tablet" as const) : ("phone" as const);

		return [res, res === "phone"] as const;
	}, [dim]);

	return [screen, isPhone, dim] as const;
};
