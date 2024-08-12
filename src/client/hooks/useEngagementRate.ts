import { SimplifedMetricTypeMap } from "@src/threadsapi/types";

import { CachedReplyData, ReplyID } from "../reply_store";
import { CachedThreadData, ThreadID } from "../thread_store";
import useCacheStore from "./useCacheStore";
import useThread, { useAllThreadReplies } from "./useThread";

export const calculateThreadEngagementRate = (
	thread: CachedThreadData,
	replyData: CachedReplyData[],
	user: SimplifedMetricTypeMap | null,
) => {
	const likes = thread.insights?.total_likes ?? 0;
	const views = thread.insights?.total_views ?? 0;
	const replies = replyData.length;
	const quotes = thread.insights?.total_quotes ?? 0;
	const reposts = thread.insights?.total_reposts ?? 0;

	const followers = user?.total_followers ?? 0;

	const engagement = (likes + replies + quotes + reposts) / followers;

	if (views === 0) {
		return [engagement, 0, 0] as const;
	}

	const reach = views / followers;

	const activity = (likes + replies + quotes + reposts) / views;

	return [engagement, reach, activity] as const;
};

export const calculateCombinedThreadEngagementRate = (
	threads: CachedThreadData[],
	replyData: Record<ThreadID | ReplyID, CachedReplyData[] | null>,
	user: SimplifedMetricTypeMap | null,
) => {
	const likes = threads.reduce((acc, thread) => acc + (thread.insights?.total_likes ?? 0), 0);
	const views = threads.reduce((acc, thread) => acc + (thread.insights?.total_views ?? 0), 0);
	const replies = threads.reduce((acc, thread) => acc + (replyData[thread.thread_id]?.length ?? 0), 0);
	const quotes = threads.reduce((acc, thread) => acc + (thread.insights?.total_quotes ?? 0), 0);
	const reposts = threads.reduce((acc, thread) => acc + (thread.insights?.total_reposts ?? 0), 0);

	const followers = user?.total_followers ?? 0;

	const engagement = (likes + replies + quotes + reposts) / followers;

	if (views === 0) {
		return [engagement, 0, 0] as const;
	}

	const reach = views / followers;

	const activity = (likes + replies + quotes + reposts) / views;

	return [engagement, reach, activity] as const;
};

export const calculateCombinedReplyEngagementRate = (
	replyData: CachedReplyData[],
	replyDatas: Record<ThreadID | ReplyID, CachedReplyData[] | null>,
	user: SimplifedMetricTypeMap | null,
) => {
	const likes = replyData.reduce((acc, thread) => acc + (thread.insights?.total_likes ?? 0), 0);
	const views = replyData.reduce((acc, thread) => acc + (thread.insights?.total_views ?? 0), 0);
	const replies = replyData.reduce((acc, thread) => acc + (replyDatas[thread.reply_id]?.length ?? 0), 0);
	const quotes = replyData.reduce((acc, thread) => acc + (thread.insights?.total_quotes ?? 0), 0);
	const reposts = replyData.reduce((acc, thread) => acc + (thread.insights?.total_reposts ?? 0), 0);

	const followers = user?.total_followers ?? 0;

	const engagement = (likes + replies + quotes + reposts) / followers;

	if (views === 0) {
		return [engagement, 0, 0] as const;
	}

	const reach = views / followers;

	const activity = (likes + replies + quotes + reposts) / views;

	return [engagement, reach, activity] as const;
};

export const calculateUserEngagementRate = (user: SimplifedMetricTypeMap | null) => {
	const likes = user?.total_likes ?? 0;
	const views = user?.total_views ?? 0;
	const replies = user?.total_replies ?? 0;
	const quotes = user?.total_quotes ?? 0;
	const reposts = user?.total_reposts ?? 0;
	const followers = user?.total_followers ?? 0;

	const engagement = (likes + replies + quotes + reposts) / followers;

	if (views === 0) {
		return [engagement, 0, 0] as const;
	}

	const reach = views / followers;

	const activity = (likes + replies + quotes + reposts) / views;

	return [engagement, reach, activity] as const;
};

export const useThreadEngagementRate = (threadid: ThreadID) => {
	const user = useCacheStore((state) => state.user_insights);
	const thread = useThread(threadid);
	const replyData = useAllThreadReplies(threadid);

	if (!thread || !replyData || !user) {
		return [0, 0, 0] as const;
	}

	return calculateThreadEngagementRate(thread, replyData, user);
};

export const useUserEngagementRate = () => {
	const user = useCacheStore((state) => state.user_insights);

	return calculateUserEngagementRate(user);
};
