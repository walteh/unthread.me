import { useCallback } from "react";

import { ThreadMedia } from "@src/threadsapi/types";

import useCacheStore from "./useCacheStore";

const useThreadInfoCallbacks = () => {
	const userThreadsInsights = useCacheStore((state) => state.user_threads_insights);
	const userThreadsReplies = useCacheStore((state) => state.user_threads_replies);

	const getLikes = useCallback(
		(thread: ThreadMedia) => {
			const dat = userThreadsInsights?.data;
			if (!dat) return 0;
			return dat[thread.id]?.data.likes?.values[0].value ?? 0;
		},
		[userThreadsInsights],
	);

	const getViews = useCallback(
		(thread: ThreadMedia) => {
			const dat = userThreadsInsights?.data;
			if (!dat) return 0;
			return dat[thread.id]?.data.views?.values[0].value ?? 0;
		},
		[userThreadsInsights],
	);

	const getReplies = useCallback(
		(thread: ThreadMedia) => {
			const dat = userThreadsReplies?.data;
			if (!dat) return [];

			const dats = dat[thread.id]?.data.data ?? [];

			// we need to look at each replies parent_id and see if it matches the thread.id, and append it to the children field
			// of the parent object

			const child_ids: string[] = [];

			dats.forEach((reply) => {
				if (reply.replied_to?.id) {
					const parent = dats.find((thread) => thread.id === reply.replied_to?.id);
					if (parent) {
						if (!parent.children) {
							parent.children = [];
						}
						parent.children.push(reply);
						child_ids.push(reply.id);
					}
				}
			});

			return dats.filter((reply) => !child_ids.includes(reply.id));
		},
		[userThreadsReplies],
	);

	return [getLikes, getViews, getReplies] as const;
};

export default useThreadInfoCallbacks;
