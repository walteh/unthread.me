import { KyInstance } from "ky";

import {
	AccessTokenResponse,
	GetUserInsightsParams,
	InsightsResponse,
	Metric,
	MetricTypeMap,
	TimeSeriesMetric,
	TotalValueMetric,
} from "./types";

const allUserMetrics: Metric[] = ["views", "likes", "replies", "reposts", "quotes", "followers_count"];

export const get_user_insights = async (inst: KyInstance, accessToken: AccessTokenResponse): Promise<MetricTypeMap> => {
	return await get_user_insights_with_params(inst, accessToken, { all_time: true });
};

export const get_user_insights_with_params = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	params: GetUserInsightsParams = {},
): Promise<MetricTypeMap> => {
	const searchParams: Record<string, string | number> = {
		metric: allUserMetrics.join(","),
		access_token: accessToken.access_token,
	};

	if (params.all_time) {
		searchParams.since = 1712991600; // from the docs
		searchParams.until = Math.floor(Date.now() / 1000);
	} else {
		if (params.since) searchParams.since = params.since;
		if (params.until) searchParams.until = params.until;
	}

	return await inst
		.get(`v1.0/${accessToken.user_id}/threads_insights`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
		})
		.then((response) => response.json<InsightsResponse<MetricTypeMap[Metric]>>())
		.then((data) => {
			const mapper: MetricTypeMap = {} as MetricTypeMap;
			for (const metric of data.data) {
				switch (metric?.name) {
					case "views":
						mapper.views = metric as TimeSeriesMetric;
						break;
					case "likes":
						mapper.likes = metric as TotalValueMetric;
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
					case "followers_count":
						mapper.followers_count = metric as TotalValueMetric;
						break;
				}
			}
			return mapper;
		})
		.catch((error: unknown) => {
			console.error("Error fetching user insights:", error);
			throw error;
		});
};

export default get_user_insights;
