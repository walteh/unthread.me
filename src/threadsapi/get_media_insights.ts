import { KyInstance } from "ky";

import {
	AccessTokenResponse,
	GetMediaInsightsParams,
	InsightsResponse,
	MediaMetric,
	MediaMetricTypeMap,
	SimplifedMediaMetricTypeMap,
} from "./types";

const allMediaMetrics: MediaMetric[] = ["views", "likes", "replies", "reposts", "quotes"];

export const get_media_insights = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
): Promise<SimplifedMediaMetricTypeMap> => {
	return await get_media_insights_with_params(inst, accessToken, mediaId, {});
};

export const get_media_insights_with_params = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
	params: GetMediaInsightsParams = {},
): Promise<SimplifedMediaMetricTypeMap> => {
	const searchParams: Record<string, string | number> = {
		metric: allMediaMetrics.join(","),
		access_token: accessToken.access_token,
	};

	if (params.since) searchParams.since = params.since;
	if (params.until) searchParams.until = params.until;

	return await inst
		.get(`v1.0/${mediaId}/insights`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
				"Accept-Encoding": "zstd",
			},
			retry: 2,
			hooks: {
				beforeRetry: [
					(retryCount) => {
						console.log("Retrying media insights request", retryCount.retryCount);
						// sleep for 1 second before retrying
						return new Promise((resolve) => setTimeout(resolve, retryCount.retryCount * 1000));
					},
				],
			},
			timeout: 10000,
		})
		.then((response) => response.json<InsightsResponse<MediaMetricTypeMap[MediaMetric]>>())
		.then((data) => {
			const mapper: SimplifedMediaMetricTypeMap = {
				total_views: 0,
				total_likes: 0,
				total_replies: 0,
				total_reposts: 0,
				total_quotes: 0,
			};
			for (const metric of data.data) {
				switch (metric?.name) {
					case "views":
						mapper.total_views = metric.values[0].value;
						break;
					case "likes":
						mapper.total_likes = metric.values[0].value;
						break;
					case "replies":
						mapper.total_replies = metric.values[0].value;
						break;
					case "reposts":
						mapper.total_reposts = metric.values[0].value;
						break;
					case "quotes":
						mapper.total_quotes = metric.values[0].value;
						break;
				}
			}
			return mapper;
		})
		.catch((error: unknown) => {
			console.error("Error fetching media insights:", error);
			throw error;
		});
};

export default get_media_insights;
