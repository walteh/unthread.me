import { KyInstance } from "ky";

import { AccessTokenResponse, ConversationResponse, Reply } from "./types";

export interface GetUserRepliesParams {
	since?: string;
	until?: string;
	limit?: number;
	all_time?: boolean;
}

export const fetch_user_replies_page = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	params?: GetUserRepliesParams,
	cursor?: string,
) => {
	const searchParams: Record<string, string | number | boolean> = {
		fields: "id,text,timestamp,media_product_type,media_type,media_url,shortcode,thumbnail_url,children,has_replies,root_post,replied_to,is_reply,hide_status,username,is_reply_owned_by_me,permalink",
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
		.get(`v1.0/me/replies`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
				"Accept-Encoding": "zstd",
			},
			retry: 5,
			timeout: 30000,
		})
		.then((response) => response.json<ConversationResponse>())
		.catch((error: unknown) => {
			console.error("Error fetching user threads:", error);
			throw error;
		});
};

export const get_user_replies = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	params?: GetUserRepliesParams,
): Promise<Record<string, Reply>> => {
	const allThreads: Reply[] = [];

	const fetchAllPages = async (cursor?: string): Promise<void> => {
		const response = await fetch_user_replies_page(inst, accessToken, params, cursor);

		allThreads.push(...response.data);

		if (response.paging?.cursors.after) {
			await fetchAllPages(response.paging.cursors.after);
		}
	};

	await fetchAllPages();

	const threadsMap: Record<string, Reply> = {};
	allThreads.forEach((thread) => {
		threadsMap[thread.id] = thread;
	});

	return threadsMap;
};

export default get_user_replies;
