import { KyInstance } from "ky";

import { AccessTokenResponse, ConversationResponse, GetConversationParams } from "./types";

export const get_conversation = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
): Promise<ConversationResponse> => {
	return await get_conversation_with_params(inst, accessToken, mediaId, {});
};

export const get_conversation_with_params = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
	params?: GetConversationParams,
): Promise<ConversationResponse> => {
	const searchParams: Record<string, string | boolean | number> = {
		fields: "id,text,timestamp,media_product_type,media_type,media_url,shortcode,thumbnail_url,children,has_replies,root_post,replied_to,is_reply,hide_status,username",
		access_token: accessToken.access_token,
		reverse: params?.reverse ?? true,
	};

	return await inst
		.get(`v1.0/${mediaId}/conversation`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
		})
		.then((response) => response.json<ConversationResponse>())
		.catch((error: unknown) => {
			console.error("Error fetching conversation:", error);
			throw error;
		});
};

export default get_conversation;
