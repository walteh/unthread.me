import { isbd, isdbAll, isdbAllNoRelative, isdbRange } from "@src/lib/ml";

import useCacheStore from "./useCacheStore";
import useThreadList, { useReplyListByThreadIDList } from "./useThreadList";

const useInsightsByDate = (date: Date) => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();
	const allReplies = useReplyListByThreadIDList();
	return isbd(date.toISOString().slice(0, 10), userInsights, userThreads, allReplies);
};

// for fun

export const useInsightsByDateRange = (startDate: Date, endDate: Date) => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();
	const allReplies = useReplyListByThreadIDList();

	return isdbRange(startDate, endDate, userInsights, userThreads, allReplies);
};

export const useInsightsByAll = () => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();
	const allReplies = useReplyListByThreadIDList();

	return isdbAll(userInsights, userThreads, allReplies);
};

export const useDaily = () => {
	const userInsights = useCacheStore((state) => state.user_insights);
	const userThreads = useThreadList();
	const allReplies = useReplyListByThreadIDList();

	return isdbAllNoRelative(userInsights, userThreads, allReplies);
};

export default useInsightsByDate;
