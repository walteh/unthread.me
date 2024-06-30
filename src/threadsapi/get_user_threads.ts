import { KyInstance } from "ky";

import { AccessTokenResponse, GetUserThreadsParams, UserThreadsResponse } from "./types";

export const get_user_threads = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	params?: GetUserThreadsParams,
): Promise<UserThreadsResponse> => {
	const searchParams: Record<string, string | number | boolean> = {
		fields: "id,media_product_type,media_type,media_url,permalink,owner,username,text,timestamp,shortcode,thumbnail_url,children,is_quote_post",
		access_token: accessToken.access_token,
	};

	if (params?.all_time) {
		searchParams.since = 1712991600; // from the docs
		searchParams.until = Math.floor(Date.now() / 1000);
	} else {
		if (params?.since) searchParams.since = params.since;
		if (params?.until) searchParams.until = params.until;
	}

	searchParams.limit = params?.limit ?? Number.MAX_SAFE_INTEGER;

	const resp = await inst
		.get(`v1.0/me/threads`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
		})
		.then((response) => response.json<UserThreadsResponse>())
		.catch((error: unknown) => {
			console.error("Error fetching user threads:", error);
			throw error;
		});

	return resp;
};

export default get_user_threads;
