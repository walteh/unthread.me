import { useLiveQuery } from "dexie-react-hooks";

import { db as yo } from "../reply_store";
import { db, ThreadID } from "../thread_store";

const useThreadList = () => {
	const thread = useLiveQuery(async () => {
		const thread = await db.threads.toArray();
		return thread;
	}, []);

	return thread ?? [];
};

export const useReplyListByThreadIDList = () => {
	const thread = useLiveQuery(async () => {
		const thread = await yo.replies.toArray();
		return thread.reduce<Record<ThreadID, typeof thread>>((acc, thread) => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (!acc[thread.thread_id]) {
				acc[thread.thread_id] = [];
			}
			acc[thread.thread_id].push(thread);
			return acc;
		}, {});
	}, []);

	return thread ?? {};
};

export default useThreadList;
