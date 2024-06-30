import { KyInstance } from "ky";

import { LongTermAccessTokenResponse } from "./types";

// Refresh Long-Lived Token function
export const refresh_long_lived_token = async (
	inst: KyInstance,
	longLivedToken: LongTermAccessTokenResponse,
): Promise<LongTermAccessTokenResponse> => {
	return await inst
		.get("refresh_access_token", {
			searchParams: {
				grant_type: "th_refresh_token",
				access_token: longLivedToken.access_token,
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
			console.error("Error refreshing long-lived access token:", error);
			throw error;
		});
};

export default refresh_long_lived_token;
