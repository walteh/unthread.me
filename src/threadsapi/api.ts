import { KyInstance } from "ky";

export const getAuthorizationStartURL = (state?: string): URL => {
	const client_id = import.meta.env.VITE_UNTHREADME_THREADS_API_APP_ID as string;

	if (!client_id) {
		throw new Error("Client ID not found");
	}

	const current_host = window.location.origin;

	const authUrl = new URL("https://threads.net/oauth/authorize");
	authUrl.searchParams.append("client_id", client_id);
	authUrl.searchParams.append("redirect_uri", current_host);
	authUrl.searchParams.append("scope", "threads_basic");
	authUrl.searchParams.append("response_type", "code");

	if (state) {
		authUrl.searchParams.append("state", state);
	}

	return authUrl;
};

export interface AccessTokenResponse {
	access_token: string;
	user_id: number;
}

export const exchangeCodeForAccessToken = async (inst: KyInstance, code: string): Promise<AccessTokenResponse> => {
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

export interface UserProfileResponse {
	id: string;
	username: string;
	threads_profile_picture_url: string;
	threads_biography: string;
}

export const getUserProfile = async (inst: KyInstance, accessToken: AccessTokenResponse): Promise<UserProfileResponse> => {
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
