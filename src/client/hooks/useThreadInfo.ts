import { useMemo } from "react";

import { ThreadMedia } from "@src/threadsapi/types";

import useThreadInfoCallbacks from "./useThreadInfoCallbacks";

const useThreadInfo = (thread: ThreadMedia) => {
	const [getLikes, getViews, getReplies, getQuotes, getReposts] = useThreadInfoCallbacks();

	const likes = useMemo(() => {
		return getLikes(thread);
	}, [getLikes, thread]);

	const views = useMemo(() => {
		return getViews(thread);
	}, [getViews, thread]);

	const replies = useMemo(() => {
		return getReplies(thread);
	}, [getReplies, thread]);

	const quotes = useMemo(() => {
		return getQuotes(thread);
	}, [getQuotes, thread]);

	const reposts = useMemo(() => {
		return getReposts(thread);
	}, [getReposts, thread]);

	return [likes, views, replies, quotes, reposts] as const;
};

export default useThreadInfo;
