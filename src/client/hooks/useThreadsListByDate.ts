import { useMemo } from "react";

import useCacheStore from "./useCacheStore";

const useThreadsListSortedByDate = () => {
	const threads = useCacheStore((state) => Object.values(state.user_threads));

	const filteredThreads = useMemo(() => {
		return threads.sort((a, b) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return new Date(b.media.timestamp).getTime() - new Date(a.media.timestamp).getTime();
		});
	}, [threads]);

	return [filteredThreads] as const;
};

export default useThreadsListSortedByDate;
