import { useMemo } from "react";

import useThreadList from "./useThreadList";

const useThreadsListSortedByDate = () => {
	const threads = useThreadList();

	const filteredThreads = useMemo(() => {
		return threads.sort((a, b) => {
			return new Date(b.media.timestamp).getTime() - new Date(a.media.timestamp).getTime();
		});
	}, [threads]);

	return [filteredThreads] as const;
};

export default useThreadsListSortedByDate;
