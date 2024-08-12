import { KyInstance } from "ky";

import { AccessTokenResponse, GetMediaInsightsParams, ThreadMedia } from "./types";

export const get_media = async (inst: KyInstance, accessToken: AccessTokenResponse, mediaId: string): Promise<ThreadMedia> => {
	return await get_media_with_params(inst, accessToken, mediaId, {});
};

export const get_media_with_params = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
	params: GetMediaInsightsParams = {},
): Promise<ThreadMedia> => {
	const searchParams: Record<string, string | number> = {
		fields: "id,media_product_type,media_type,media_url,permalink,owner,username,text,timestamp,shortcode,thumbnail_url,children,is_quote_post",
		access_token: accessToken.access_token,
	};

	if (params.since) searchParams.since = params.since;
	if (params.until) searchParams.until = params.until;

	return await inst
		.get(`v1.0/${mediaId}`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
				"Accept-Encoding": "zstd",
			},
			retry: 5,
			hooks: {
				beforeRetry: [
					(retryCount) => {
						console.log("Retrying media request", retryCount.retryCount);
						// sleep for 1 second before retrying
						return new Promise((resolve) => setTimeout(resolve, retryCount.retryCount * 1000));
					},
				],
			},
			timeout: 30000,
		})
		.then((response) => response.json<ThreadMedia>())

		.catch((error: unknown) => {
			console.error("Error fetching media:", error);
			throw error;
		});
};

export default get_media;
