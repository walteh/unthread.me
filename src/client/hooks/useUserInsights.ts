import { useMemo } from "react";

import { SimplifedMetricTypeMap, SimplifiedDemographicMetric } from "@src/threadsapi/types";

import useCacheStore from "./useCacheStore";

const useUserInsights = () => {
	const data = useCacheStore((state) => state.user_insights);
	const demoGraphics = useCacheStore((state) => state.user_follower_demographics);

	const dataReformt = useMemo(() => {
		if (!data?.data) {
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
			...data.data,

			// Adjust the data here
		} as SimplifedMetricTypeMap & SimplifiedDemographicMetric;
	}, [data]);

	const demoReformat = useMemo(() => {
		if (!demoGraphics?.data) {
			return {
				demographics_by_age: [],
				demographics_by_country: [],
				demographics_by_city: [],
				demographics_by_gender: [],
			} as SimplifiedDemographicMetric;
		}

		return {
			demographics_by_age: demoGraphics.data.age.simplified_values.sort((a, b) => a.value - b.value),
			demographics_by_country: demoGraphics.data.country.simplified_values.sort((a, b) => a.value - b.value),
			demographics_by_city: demoGraphics.data.city.simplified_values.sort((a, b) => a.value - b.value),
			demographics_by_gender: demoGraphics.data.gender.simplified_values.sort((a, b) => a.value - b.value),

			// Adjust the data here
		} as SimplifiedDemographicMetric;
	}, [demoGraphics]);

	return [dataReformt, demoReformat] as const;
};

export default useUserInsights;
