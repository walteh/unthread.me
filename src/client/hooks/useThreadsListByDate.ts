import { useMemo } from "react";

import useThreadList, { useMyReplyList } from "./useThreadList";

const useThreadsListSortedByDate = () => {
	const threads = useThreadList();

	const filteredThreads = useMemo(() => {
		return threads.sort((a, b) => {
			return new Date(b.media.timestamp).getTime() - new Date(a.media.timestamp).getTime();
		});
	}, [threads]);

	return [filteredThreads] as const;
};

export const useThreadsAndReplyListSortedByDate = () => {
	const threads = useThreadList();
	const replies = useMyReplyList();

	const filteredThreads = useMemo(() => {
		return [...threads, ...replies].sort((a, b) => {
			return new Date(b.media.timestamp).getTime() - new Date(a.media.timestamp).getTime();
		});
	}, [threads, replies]);

	return [filteredThreads] as const;
};

export default useThreadsListSortedByDate;
