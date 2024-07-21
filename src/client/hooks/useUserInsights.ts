import { useMemo } from "react";

import { SimplifedMetricTypeMap, SimplifiedDemographicMetric } from "@src/threadsapi/types";

import useCacheStore from "./useCacheStore";

const useUserInsights = () => {
	const data = useCacheStore((state) => state.user_insights);
	const demoGraphics = useCacheStore((state) => state.user_follower_demographics);

	const dataReformt = useMemo(() => {
		if (!data) {
			return {
				total_likes: 0,
				total_views: 0,
				total_replies: 0,
				total_followers: 0,
				total_quotes: 0,
				total_reposts: 0,
				views_by_day: [],
			} as SimplifedMetricTypeMap;
		}

		return {
			...data,
		} as SimplifedMetricTypeMap;
	}, [data]);

	const demoReformat = useMemo(() => {
		if (!demoGraphics) {
			return {
				demographics_by_age: [],
				demographics_by_country: [],
				demographics_by_city: [],
				demographics_by_gender: [],
			} as SimplifiedDemographicMetric;
		}

		return {
			demographics_by_age: demoGraphics.age.simplified_values.sort((a, b) => a.value - b.value),
			demographics_by_country: demoGraphics.country.simplified_values.sort((a, b) => a.value - b.value),
			demographics_by_city: demoGraphics.city.simplified_values.sort((a, b) => a.value - b.value),
			demographics_by_gender: demoGraphics.gender.simplified_values.sort((a, b) => a.value - b.value),

			// Adjust the data here
		} as SimplifiedDemographicMetric;
	}, [demoGraphics]);

	return [dataReformt, demoReformat] as const;
};

export default useUserInsights;
