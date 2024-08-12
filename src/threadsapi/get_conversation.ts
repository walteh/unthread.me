import { KyInstance } from "ky";

import { AccessTokenResponse, ConversationResponse, GetConversationParams, Reply } from "./types";

export const get_conversation = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
): Promise<ConversationResponse> => {
	return await get_conversation_with_params(inst, accessToken, mediaId, {});
};

const fetch_conversation_page = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
	params?: GetConversationParams,
	cursor?: string,
): Promise<ConversationResponse> => {
	const searchParams: Record<string, string | boolean | number> = {
		fields: "id,text,timestamp,media_product_type,media_type,media_url,shortcode,thumbnail_url,children,has_replies,root_post,replied_to,is_reply,hide_status,username,is_reply_owned_by_me,permalink",
		access_token: accessToken.access_token,
		reverse: params?.reverse ?? true,
	};

	if (cursor) {
		searchParams.after = cursor;
	}

	return await inst
		.get(`v1.0/${mediaId}/conversation`, {
			searchParams,
			retry: 5,
			headers: {
				"Content-Type": "application/json",
				// zstd encoding
				"Accept-Encoding": "zstd",
			},
			timeout: 30000,
		})
		.then((response) => response.json<ConversationResponse>())
		.catch((error: unknown) => {
			console.error("Error fetching conversation:", error);
			throw error;
		});
};

export const get_conversation_with_params = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
	params?: GetConversationParams,
): Promise<ConversationResponse> => {
	const allReplies: Reply[] = [];

	const fetchAllPages = async (cursor?: string): Promise<void> => {
		const response = await fetch_conversation_page(inst, accessToken, mediaId, params, cursor);

		allReplies.push(...response.data);

		if (response.paging?.cursors.after) {
			await fetchAllPages(response.paging.cursors.after);
		}
	};

	await fetchAllPages();

	return {
		data: allReplies,
	};
};

export default get_conversation;
