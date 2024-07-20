import { KyInstance } from "ky";

import { AccessTokenResponse, ThreadMedia, UserThreadsResponse } from "./types";

export interface GetUserThreadsParams {
	since?: string;
	until?: string;
	limit?: number;
	all_time?: boolean;
}

export const fetch_user_threads_page = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	params?: GetUserThreadsParams,
	cursor?: string,
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
	searchParams.limit = 100;

	if (cursor) {
		searchParams.after = cursor;
	}

	return await inst
		.get(`v1.0/me/threads`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
				"Accept-Encoding": "zstd",
			},
			timeout: 10000,
		})
		.then((response) => response.json<UserThreadsResponse>())
		.catch((error: unknown) => {
			console.error("Error fetching user threads:", error);
			throw error;
		});
};

export const get_user_threads = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	params?: GetUserThreadsParams,
): Promise<Record<string, ThreadMedia>> => {
	const allThreads: ThreadMedia[] = [];

	const fetchAllPages = async (cursor?: string): Promise<void> => {
		const response = await fetch_user_threads_page(inst, accessToken, params, cursor);

		allThreads.push(...response.data);

		if (response.paging?.cursors.after) {
			await fetchAllPages(response.paging.cursors.after);
		}
	};

	await fetchAllPages();

	const threadsMap: Record<string, ThreadMedia> = {};
	allThreads.forEach((thread) => {
		threadsMap[thread.id] = thread;
	});

	return threadsMap;
};

export default get_user_threads;
