import { ThreadID } from "../cache_store";
import useCacheStore from "./useCacheStore";

const useThreadInfo = (thread: ThreadID) => {
	const likes = useCacheStore((state) => state.user_threads[thread].insights?.total_likes ?? 0);

	const views = useCacheStore((state) => state.user_threads[thread].insights?.total_views ?? 0);

	const replies = useCacheStore((state) => state.user_threads[thread].replies?.data ?? []);

	const quotes = useCacheStore((state) => state.user_threads[thread].insights?.total_quotes ?? 0);

	const reposts = useCacheStore((state) => state.user_threads[thread].insights?.total_reposts ?? 0);

	return [likes, views, replies, quotes, reposts] as const;
};

export default useThreadInfo;
