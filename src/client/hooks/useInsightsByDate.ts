import { convertToInsightsByDate, isbd, isdbAll, isdbAllNoRelative, isdbRange } from "@src/lib/ml";

import { ThreadID } from "../cache_store";
import useCacheStore from "./useCacheStore";

const useInsightsByDate = (date: Date) => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useCacheStore((state) =>
		Object.keys(state.user_threads).map((key) => convertToInsightsByDate(state.user_threads[key as ThreadID])),
	);
	return isbd(date.toISOString().slice(0, 10), userInsights, userThreads);
};

export const useInsightsByDateRange = (startDate: Date, endDate: Date) => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useCacheStore((state) =>
		Object.keys(state.user_threads).map((key) => convertToInsightsByDate(state.user_threads[key as ThreadID])),
	);
	return isdbRange(startDate, endDate, userInsights, userThreads);
};

export const useInsightsByAll = () => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useCacheStore((state) => state.user_threads);

	return isdbAll(
		userInsights,
		Object.keys(userThreads).map((key) => convertToInsightsByDate(userThreads[key as ThreadID])),
	);
};

export const useDaily = () => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useCacheStore((state) => state.user_threads);

	return isdbAllNoRelative(
		userInsights,
		Object.keys(userThreads).map((key) => convertToInsightsByDate(userThreads[key as ThreadID])),
	);
};

export default useInsightsByDate;
