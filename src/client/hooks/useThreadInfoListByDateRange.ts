import { useMemo } from "react";

import useThreadsListSortedByDate from "./useThreadsListByDate";

export const useUserThreadsByDateRange = (start_date: string, end_date: string) => {
	const [userThreads] = useThreadsListSortedByDate();

	return useMemo(() => {
		return userThreads.filter((thread) => {
			const threadDate = new Date(thread.media.timestamp).toISOString().slice(0, 10);
			return threadDate >= start_date && threadDate <= end_date;
		});
	}, [userThreads, start_date, end_date]);
};

export default useUserThreadsByDateRange;
