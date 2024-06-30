import { KyInstance } from "ky";

import { AccessTokenResponse, LongTermAccessTokenResponse } from "./types";

export const exchange_short_lived_for_long_lived_token = async (inst: KyInstance, access_token: AccessTokenResponse) => {
	return await inst
		.post("beta/threads-api-oauth-proxy", {
			searchParams: {
				short_lived_token: access_token.access_token,
			},
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
		})

		.then((data) => {
			console.log({ data });
			return data.json<LongTermAccessTokenResponse>();
		})
		.catch((error: unknown) => {
			console.error("Error fetching access token:", error);
			throw error;
		});
};

export default exchange_short_lived_for_long_lived_token;
