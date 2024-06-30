import { useMemo } from "react";

import { AccessTokenResponse } from "../../threadsapi/types";
import client from "..";

export const useIsLoggedIn = () => {
	const accessToken = client.token_store((state) => state.access_token);
	const longLivedToken = client.token_store((state) => state.long_lived_token);
	const longLivedTokenExpiresAt = client.token_store((state) => state.long_lived_token_expires_at);
	const accessTokenExpiresAt = client.token_store((state) => state.access_token_expires_at);

	return useMemo(() => {
		// make sure we have an access token, it holds the users id
		if (!accessToken.access_token) {
			return [false, {} as AccessTokenResponse] as const;
		}
		// use the login token if it's still valid

		// use the long-lived token if it's still valid
		if (longLivedToken && longLivedTokenExpiresAt && longLivedTokenExpiresAt > Date.now()) {
			return [
				true,
				{
					access_token: longLivedToken.access_token,
					user_id: accessToken.user_id,
				},
				longLivedTokenExpiresAt,
			] as const;
		}

		if (accessToken.access_token && accessTokenExpiresAt && accessTokenExpiresAt > Date.now()) {
			return [true, accessToken, accessTokenExpiresAt] as const;
		}

		return [false, {} as AccessTokenResponse, 0] as const;
	}, [accessToken, longLivedToken, longLivedTokenExpiresAt, accessTokenExpiresAt]);
};
