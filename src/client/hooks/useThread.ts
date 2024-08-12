import { useLiveQuery } from "dexie-react-hooks";

import { db as yo, ReplyID } from "../reply_store";
import { db, ThreadID } from "../thread_store";

const useThread = (id: ThreadID) => {
	const thread = useLiveQuery(async () => {
		const thread = await db.threads.get(id);
		return thread;
	}, [id]);

	return thread;
};

export const useReply = (id: ReplyID) => {
	const thread = useLiveQuery(async () => {
		const thread = await yo.replies.get(id);
		return thread;
	}, [id]);

	return thread;
};

export const useAllThreadReplies = (id: ThreadID) => {
	const thread = useLiveQuery(async () => {
		const thread = await yo.replies.where({ thread_id: id }).toArray();
		return thread;
	}, [id]);

	return thread;
};

export const useAllReplyReplies = (id: ReplyID) => {
	const thread = useLiveQuery(async () => {
		const thread = await yo.replies.where({ parent_reply_id: id }).toArray();
		return thread;
	}, [id]);

	return thread;
};

export const useTopLevelThreadReplies = (id: ThreadID) => {
	const thread = useLiveQuery(async () => {
		// const thread = await yo.replies.filter((thread) => thread.thread_id === id && thread.parent_reply_id === id).toArray();
		const thread = await yo.replies.where({ thread_id: id, parent_reply_id: id }).toArray();
		return thread;
	}, [id]);

	return thread;
};

export default useThread;
