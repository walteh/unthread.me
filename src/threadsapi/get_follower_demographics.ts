import { KyInstance } from "ky";

import {
	AccessTokenResponse,
	Breakdown,
	BreakdownMetricTypeMap,
	DemographicMetric,
	DemographicMetricPayload,
	InsightsResponse,
} from "./types";

const breakdownTypes: Breakdown[] = ["country", "city", "age", "gender"];

export const get_follower_demographics = async (inst: KyInstance, accessToken: AccessTokenResponse): Promise<BreakdownMetricTypeMap> => {
	const fetchDemographic = async (breakdown: Breakdown) => {
		const searchParams: Record<string, string> = {
			metric: "follower_demographics",
			access_token: accessToken.access_token,
			breakdown: breakdown,
		};

		return await inst
			.get(`v1.0/${accessToken.user_id}/threads_insights`, {
				searchParams,
				headers: {
					"Content-Type": "application/json",
				},
				timeout: 10000,
			})
			.then((response) => response.json<InsightsResponse<DemographicMetricPayload>>())
			.then((data) => {
				// cionvert the payload to the correct type
				const breakdown = data.data[0].total_value.breakdowns[0];

				const items: { label: string; value: number }[] = [];

				for (const item of breakdown.results) {
					items.push({
						label: item.dimension_values.join(", "),
						value: item.value,
					});
				}

				const demographic: DemographicMetric = {
					...data.data[0],
					simplified_values: items,
				};

				return demographic;
			})
			.catch((error: unknown) => {
				console.error("Error fetching follower demographics insights:", error);
				throw error;
			});
	};

	const results = await Promise.all(breakdownTypes.map(fetchDemographic));

	const demographics: BreakdownMetricTypeMap = {
		country: results[0],
		city: results[1],
		age: results[2],
		gender: results[3],
	};

	return demographics;
};

export default get_follower_demographics;
