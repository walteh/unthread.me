import ky, { KyInstance } from "ky";

import {
	AccessTokenResponse,
	GetUserInsightsParams,
	InsightsResponse,
	Metric,
	MetricTypeMap,
	SimplifedMetricTypeMap,
	TimeSeriesMetric,
	TotalValueMetric,
} from "./types";

const allUserMetrics: Metric[] = ["views", "likes", "replies", "reposts", "quotes", "followers_count"];

export const get_user_insights = async (inst: KyInstance, accessToken: AccessTokenResponse): Promise<SimplifedMetricTypeMap> => {
	return await get_user_insights_with_params(inst, accessToken, { all_time: true });
};

const fetch_user_insights_page = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	params: GetUserInsightsParams,
	cursor?: string,
): Promise<InsightsResponse<MetricTypeMap[Metric]>> => {
	if (cursor) {
		return await ky
			.get(cursor, {
				headers: {
					"Content-Type": "application/json",
				},

				retry: 10,
				hooks: {
					beforeRetry: [
						(retryCount) => {
							console.log("Retrying user insights request", retryCount.retryCount);
							// sleep for 1 second before retrying
							return new Promise((resolve) => setTimeout(resolve, retryCount.retryCount * 1000));
						},
					],
				},
				timeout: 10000,
			})
			.then((response) => response.json<InsightsResponse<MetricTypeMap[Metric]>>())
			.catch((error: unknown) => {
				console.error("Error fetching user insights:", error);
				throw error;
			});
	}

	const searchParams: Record<string, string | number> = {
		metric: allUserMetrics.join(","),
		access_token: accessToken.access_token,
	};
	let isapril = false;
	if (params.all_time) {
		if (params.june_not_april === true) {
			searchParams.since = 1717225200; // from the docs
		} else {
			searchParams.since = 1712991600; // from the docs
			isapril = true;
		}
		searchParams.until = Math.floor(Date.now() / 1000);
	} else {
		if (params.since) searchParams.since = params.since;
		if (params.until) searchParams.until = params.until;
	}

	return await inst
		.get(`v1.0/me/threads_insights`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
			},
			retry: 10,
			hooks: {
				beforeRetry: [
					(retryCount) => {
						console.log("Retrying user insights request", retryCount.retryCount);
						// sleep for 1 second before retrying
						return new Promise((resolve) => setTimeout(resolve, retryCount.retryCount * 1000));
					},
				],
			},
			timeout: 10000,
		})
		.then((response) => response.json<InsightsResponse<MetricTypeMap[Metric]>>())
		.catch((error: unknown) => {
			console.error("Error fetching user insights:", error);
			if (isapril) {
				return fetch_user_insights_page(inst, accessToken, {
					...params,
					june_not_april: true,
				});
			}
			throw error;
		});
};

export const get_user_insights_with_params = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	params: GetUserInsightsParams = {},
): Promise<SimplifedMetricTypeMap> => {
	const allMetrics: SimplifedMetricTypeMap = {
		views_by_day: [],
		total_likes: 0,
		total_replies: 0,
		total_reposts: 0,
		total_quotes: 0,
		total_followers: 0,
		total_views: 0,
	} as SimplifedMetricTypeMap;

	const fetchAllPages = async (cursor?: string): Promise<void> => {
		const response = await fetch_user_insights_page(inst, accessToken, params, cursor);

		for (const metric of response.data) {
			switch (metric?.name) {
				case "views":
					allMetrics.views_by_day = allMetrics.views_by_day.concat(
						(metric as TimeSeriesMetric).values.map((item) => {
							// const date = new Date(item.end_time);
							// // date.setTime(date.getTime() - 1000);
							// const pacificTime = date.toLocaleString("en-US", {
							// 	timeZone: "America/Los_Angeles",
							// 	month: "2-digit",
							// 	day: "2-digit",
							// 	year: "numeric",
							// });
							// const datez = new Date(pacificTime);

							// const year = datez.getFullYear();
							// const month = String(datez.getMonth() + 1).padStart(2, "0");
							// const day = String(datez.getDate()).padStart(2, "0");

							// const formattedDate = `${year}-${month}-${day}`;

							return {
								// Subtract one minute (60000 milliseconds)

								// label: formattedDate, /// thisis midnight pacific time returnred "2024-04-14T07:00:00+0000"
								label: item.end_time,
								value: item.value,
							};
						}),
					);
					allMetrics.total_views += (metric as TimeSeriesMetric).values.reduce((acc, item) => acc + item.value, 0);
					break;
				case "likes":
					allMetrics.total_likes = (metric as TotalValueMetric).total_value.value;
					break;
				case "replies":
					allMetrics.total_replies = (metric as TotalValueMetric).total_value.value;
					break;
				case "reposts":
					allMetrics.total_reposts = (metric as TotalValueMetric).total_value.value;
					break;
				case "quotes":
					allMetrics.total_quotes = (metric as TotalValueMetric).total_value.value;
					break;
				case "followers_count":
					allMetrics.total_followers = (metric as TotalValueMetric).total_value.value;
					break;
			}
		}

		// if (response.paging?.previous) {
		// 	await fetchAllPages(response.paging.previous);
		// }
	};

	await fetchAllPages();

	return allMetrics;
};

export default get_user_insights;
