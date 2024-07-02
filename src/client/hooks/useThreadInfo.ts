import { useMemo } from "react";

import { ThreadMedia } from "@src/threadsapi/types";

import useThreadInfoCallbacks from "./useThreadInfoCallbacks";

const useThreadInfo = (thread: ThreadMedia) => {
	const [getLikes, getViews, getReplies] = useThreadInfoCallbacks();

	const likes = useMemo(() => {
		return getLikes(thread);
	}, [getLikes, thread]);

	const views = useMemo(() => {
		return getViews(thread);
	}, [getViews, thread]);

	const replies = useMemo(() => {
		return getReplies(thread);
	}, [getReplies, thread]);

	return [likes, views, replies] as const;
};

export default useThreadInfo;
