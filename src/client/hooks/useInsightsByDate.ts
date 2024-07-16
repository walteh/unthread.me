import { isbd, isdbAll, isdbRange } from "@src/lib/ml";
import { SimplifedMediaMetricTypeMap, SimplifedMetricTypeMap } from "@src/threadsapi/types";

import useCacheStore from "./useCacheStore";

const useInsightsByDate = (date: Date) => {
	const userInsights = useCacheStore((state) => state.user_insights?.data ?? ({} as SimplifedMetricTypeMap));
	const userThreads = Object.values(useCacheStore((state) => state.user_threads?.data ?? {}));
	const userThreadsInsights = useCacheStore((state) => state.user_threads_insights?.data ?? {}) as Record<
		string,
		{ data: SimplifedMediaMetricTypeMap }
	>;

	return isbd(date.toISOString().slice(0, 10), userInsights, userThreads, userThreadsInsights);
};

export const useInsightsByDateRange = (startDate: Date, endDate: Date) => {
	const userInsights = useCacheStore((state) => state.user_insights?.data ?? ({} as SimplifedMetricTypeMap));
	const userThreads = Object.values(useCacheStore((state) => state.user_threads?.data ?? {}));
	const userThreadsInsights = useCacheStore((state) => state.user_threads_insights?.data ?? {}) as Record<
		string,
		{ data: SimplifedMediaMetricTypeMap }
	>;

	return isdbRange(startDate, endDate, userInsights, userThreads, userThreadsInsights);
};

export const useInsightsByAll = () => {
	const userInsights = useCacheStore((state) => state.user_insights?.data ?? ({} as SimplifedMetricTypeMap));
	const userThreads = Object.values(useCacheStore((state) => state.user_threads?.data ?? {}));
	const userThreadsInsights = useCacheStore((state) => state.user_threads_insights?.data ?? {}) as Record<
		string,
		{ data: SimplifedMediaMetricTypeMap }
	>;

	return isdbAll(userInsights, userThreads, userThreadsInsights);
};

export default useInsightsByDate;
