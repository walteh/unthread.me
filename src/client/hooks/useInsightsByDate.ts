import { isdbAll, isdbAllNoRelative, isdbAllNoRelativeMonthly, isdbAllNoRelativeWeekly, isdbRange } from "@src/lib/ml";

import useCacheStore from "./useCacheStore";
import useThreadList, { useMyReplyList } from "./useThreadList";

const useInsightsByDate = (date: Date) => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();
	const allReplies = useMyReplyList();
	return isdbRange(date, date, userInsights, userThreads, allReplies);
};

// for fun

export const useInsightsByDateRange = (startDate: Date, endDate: Date) => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();
	const allReplies = useMyReplyList();

	return isdbRange(startDate, endDate, userInsights, userThreads, allReplies);
};

export const useInsightsByAll = () => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();
	const allReplies = useMyReplyList();

	return isdbAll(userInsights, userThreads, allReplies);
};

export const useDaily = () => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();
	const allReplies = useMyReplyList();

	return isdbAllNoRelative(userInsights, userThreads, allReplies);
};

export const useWeekly = () => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();
	const allReplies = useMyReplyList();

	return isdbAllNoRelativeWeekly(userInsights, userThreads, allReplies);
};

export const useMonthly = () => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();
	const allReplies = useMyReplyList();

	return isdbAllNoRelativeMonthly(userInsights, userThreads, allReplies);
};

export default useInsightsByDate;
