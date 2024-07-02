import { useMemo } from "react";

import useCacheStore from "./useCacheStore";

const useThreadsListSortedByDate = () => {
	const threads = useCacheStore((state) => state.user_threads);

	const filteredThreads = useMemo(() => {
		if (!threads?.data) return [];

		return Object.values(threads.data).sort((a, b) => {
			return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
		});
	}, [threads]);

	return [filteredThreads] as const;
};

export default useThreadsListSortedByDate;
