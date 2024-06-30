import { KyInstance } from "ky";

import { AccessTokenResponse, UserProfileResponse } from "./types";

export const get_user_profile = async (inst: KyInstance, accessToken: AccessTokenResponse): Promise<UserProfileResponse> => {
	return await inst
		.get(`v1.0/${accessToken.user_id}`, {
			searchParams: {
				fields: "id,username,threads_profile_picture_url,threads_biography",
				access_token: accessToken.access_token,
			},
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
		})
		.then((response) => {
			console.log({ response });
			return response.json<UserProfileResponse>();
		})
		.catch((error: unknown) => {
			console.error("Error fetching user profile:", error);
			throw error;
		});
};

export default get_user_profile;
