import { isbd, isdbAll, isdbAllNoRelative, isdbRange } from "@src/lib/ml";

import useCacheStore from "./useCacheStore";
import useThreadList from "./useThreadList";

const useInsightsByDate = (date: Date) => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();
	return isbd(date.toISOString().slice(0, 10), userInsights, userThreads);
};

// for fun

export const useInsightsByDateRange = (startDate: Date, endDate: Date) => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();

	return isdbRange(startDate, endDate, userInsights, userThreads);
};

export const useInsightsByAll = () => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();

	return isdbAll(userInsights, userThreads);
};

export const useDaily = () => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();

	return isdbAllNoRelative(userInsights, userThreads);
};

export default useInsightsByDate;
