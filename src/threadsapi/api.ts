import { KyInstance } from "ky";

interface RefreshTokenResponse {
	access_token: string;
}

export const refreshAccessToken = async (inst: KyInstance, token: string): Promise<string> => {
	return await inst
		.get(`access_token/refresh_access_token?grant_type=th_refresh_token&access_token=${token}`)
		.json<RefreshTokenResponse>()
		.then((data) => data.access_token);
};

export const fetchAccessToken = async (inst: KyInstance, secret: string, token: string): Promise<string> => {
	return await inst
		.get(`access_token?grant_type=th_exchange_token&client_secret=${secret}&access_token=${token}`, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.json<RefreshTokenResponse>()
		.then((data) => data.access_token);
};
