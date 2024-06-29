import { useState } from "react";
import { useInterval } from "usehooks-ts";

import { usePersistantStore } from "@src/threadsapi/store";

const useAccessTokenExpiresIn = () => {
	const expirationTime = usePersistantStore((state) => state.access_token_expires_at);

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

	return [expiresIn] as const;
};

export default useAccessTokenExpiresIn;
