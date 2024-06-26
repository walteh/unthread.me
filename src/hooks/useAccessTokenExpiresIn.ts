import useStore from "@src/threadsapi/store";
import { useState } from "react";

import { useInterval } from "usehooks-ts";

const useAccessTokenExpiresIn = (): number => {
	const expirationTime = useStore((state) => state.access_token_expires_at);

	const [expiresIn, setExpiresIn] = useState(expirationTime ? expirationTime - Date.now() : 0);

	useInterval(() => {
		if (!expirationTime) {
			if (expiresIn !== 0) {
				setExpiresIn(0);
			}
			return;
		}
		setExpiresIn(expirationTime - Date.now());
	}, 1000);

	return expiresIn;
};

export default useAccessTokenExpiresIn;
