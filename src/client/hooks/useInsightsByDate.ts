import { isbd, isdbAll, isdbRange } from "@src/lib/ml";

import useCacheStore from "./useCacheStore";

const useInsightsByDate = (date: Date) => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useCacheStore((state) => Object.values(state.user_threads));

	return isbd(date.toISOString().slice(0, 10), userInsights, userThreads);
};

export const useInsightsByDateRange = (startDate: Date, endDate: Date) => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useCacheStore((state) => Object.values(state.user_threads));
	return isdbRange(startDate, endDate, userInsights, userThreads);
};

export const useInsightsByAll = () => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useCacheStore((state) => Object.values(state.user_threads));
	return isdbAll(userInsights, userThreads);
};

export default useInsightsByDate;
