import { KyInstance } from "ky";

import { AccessTokenResponse } from "./types";

export const exchange_code_for_short_lived_token = async (inst: KyInstance, code: string): Promise<AccessTokenResponse> => {
	return await inst
		.post("beta/threads-api-oauth-proxy", {
			searchParams: {
				code: code,
			},
			headers: {
				"Content-Type": "application/json",
			},

			// mode: "no-cors",
			timeout: 10000,
		})

		.then((data) => {
			console.log({ data });
			return data.json<AccessTokenResponse>();
		})
		.catch((error: unknown) => {
			console.error("Error fetching access token:", error);
			throw error;
		});
};

export default exchange_code_for_short_lived_token;
