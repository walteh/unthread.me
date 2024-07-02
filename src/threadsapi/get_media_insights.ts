import { KyInstance } from "ky";

import {
	AccessTokenResponse,
	GetMediaInsightsParams,
	InsightsResponse,
	MediaMetric,
	MediaMetricTypeMap,
	TimeSeriesMetric,
	TotalValueMetric,
} from "./types";

const allMediaMetrics: MediaMetric[] = ["views", "likes", "replies", "reposts", "quotes"];

export const get_media_insights = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
): Promise<MediaMetricTypeMap> => {
	return await get_media_insights_with_params(inst, accessToken, mediaId, {});
};

export const get_media_insights_with_params = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
	params: GetMediaInsightsParams = {},
): Promise<MediaMetricTypeMap> => {
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
			const mapper: MediaMetricTypeMap = {} as MediaMetricTypeMap;
			for (const metric of data.data) {
				switch (metric?.name) {
					case "views":
						mapper.views = metric as TimeSeriesMetric;
						break;
					case "likes":
						mapper.likes = metric as TimeSeriesMetric;
						break;
					case "replies":
						mapper.replies = metric as TotalValueMetric;
						break;
					case "reposts":
						mapper.reposts = metric as TotalValueMetric;
						break;
					case "quotes":
						mapper.quotes = metric as TotalValueMetric;
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
