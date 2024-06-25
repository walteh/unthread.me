import { KyInstance } from "ky";

// interface ErrorResponse {
// 	error_type: string;
// 	code: number;
// 	error_message: string;
// }

// interface AuthorizationCodeResponse {
// 	code: string;
// }

export interface AccessTokenResponse {
	access_token: string;
	user_id: number;
}

export const getAuthorizationStartURL = (state?: string): URL => {
	const client_id = import.meta.env.VITE_UNTHREADME_THREADS_API_APP_ID as string;

	if (!client_id) {
		throw new Error("Client ID not found");
	}

	const current_host = window.location.origin;

	const authUrl = new URL("https://threads.net/oauth/authorize");
	authUrl.searchParams.append("client_id", client_id);
	authUrl.searchParams.append("redirect_uri", `${current_host}/oauth/callback`);
	authUrl.searchParams.append("scope", "threads_basic");
	authUrl.searchParams.append("response_type", "code");

	if (state) {
		authUrl.searchParams.append("state", state);
	}

	return authUrl;
};

export const exchangeCodeForAccessToken = async (inst: KyInstance, code: string): Promise<AccessTokenResponse> => {
	return await inst
		.post("beta/threads-api-oauth-proxy", {
			searchParams: {
				code: code,
			},
			headers: {
				"Content-Type": "application/json",
			},
			mode: "no-cors",
		})
		.json<AccessTokenResponse>();
};
