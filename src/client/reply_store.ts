import Dexie, { type EntityTable } from "dexie";
import { KyInstance } from "ky";

import get_media_insights from "@src/threadsapi/get_media_insights";
import { fetch_user_replies_page } from "@src/threadsapi/get_user_replies";
import { GetUserThreadsParams } from "@src/threadsapi/get_user_threads";

import { AccessTokenResponse, Reply, SimplifedMediaMetricTypeMap } from "../threadsapi/types";
import { ThreadID } from "./thread_store";

export interface CachedReplyData {
	type: "reply";
	reply_id: ReplyID;
	thread_id: ThreadID;
	username: string;
	parent_reply_id: ReplyID | ThreadID | null;
	media: Reply;
	insights: SimplifedMediaMetricTypeMap | null;
}

export type ReplyID = `reply_${string}`;

export function makeReplyID(id: string): ReplyID {
	return `reply_${id}`;
}

export function extractReplyID(id: ReplyID): string {
	return id.replace(/^reply_/, "").split("_")[0];
}

const db = new Dexie("unthread.me/reply_store") as Dexie & {
	replies: EntityTable<
		CachedReplyData,
		"reply_id" // primary key "id" (for the typings only)
	>;
};

// Schema declaration:
db.version(1).stores({
	replies: "++reply_id, type, username, thread_id, parent_reply_id, media, replies, insights", // Primary key and indexed props
});

export { db };

const loadUserRepliesData = async (ky: KyInstance, token: AccessTokenResponse, params?: GetUserThreadsParams, get_insights = false) => {
	const promises: Promise<unknown>[] = [];

	if (localStorage.getItem("unthread.me/reply_store")) {
		localStorage.removeItem("unthread.me/reply_store");
	}
	// let count = 0;
	const fetchAllPages = async (cursor?: string): Promise<void> => {
		const data = await fetch_user_replies_page(ky, token, params, cursor);

		promises.push(
			db.replies.bulkPut(
				data.data.map((thread) => {
					const id = makeReplyID(thread.id);
					const isRoot = thread.root_post?.id === thread.replied_to?.id && thread.root_post;

					return {
						reply_id: id,
						thread_id: thread.root_post ? `thread_${thread.root_post.id}` : `thread_unknown`,
						parent_reply_id: thread.replied_to
							? isRoot
								? `thread_${thread.replied_to.id}`
								: makeReplyID(thread.replied_to.id)
							: null,
						media: thread,
						username: thread.username,
						replies: null,
						insights: null,
						type: "reply",
					};
				}),
				// {
				// 	allKeys: false,
				// },
			),
		);

		if (get_insights) {
			const proms = data.data.map((reply) => {
				return justLoadReplyInsightsData(ky, token, makeReplyID(reply.id)).then((data) => {
					return { changes: { insights: data }, key: makeReplyID(reply.id) };
				});
			});

			const allProms = Promise.all(proms).then(async (data) => {
				console.log("updating reply insights");
				await db.replies.bulkUpdate(data).then(() => {
					console.log("done updating reply insights");
				});
			});

			promises.push(allProms);
		}

		if (data.paging?.cursors.after && !params?.limit) {
			await fetchAllPages(data.paging.cursors.after);
		}
	};

	await fetchAllPages();
	await Promise.all(promises);
};

const loadReplyInsightsData = async (ky: KyInstance, token: AccessTokenResponse, id: ReplyID) => {
	await get_media_insights(ky, token, extractReplyID(id)).then(async (data) => {
		await db.replies.update(id, { insights: data });
	});
};

const justLoadReplyInsightsData = async (ky: KyInstance, token: AccessTokenResponse, id: ReplyID) => {
	return await get_media_insights(ky, token, extractReplyID(id));
};

// const loadAllReplyInsightsData = async (ky: KyInstance, token: AccessTokenResponse) => {
// 	await db.replies.each(async (reply) => {
// 		await get_media_insights(ky, token, extractReplyID(reply.reply_id)).then(async (data) => {
// 			await db.replies.update(reply.reply_id, { insights: data });
// 		});
// 	});
// };

// const loadReplyRepliesData = async (ky: KyInstance, token: AccessTokenResponse, id: ReplyID) => {
// 	await get_conversation(ky, token, extractReplyID(id)).then(async (data) => {
// 		await db.replies.bulkPut(
// 			data.data.map((thread) => {
// 				const id = makeReplyID(thread.id);
// 				const isRoot = thread.root_post?.id === thread.replied_to?.id && thread.root_post;

// 				return {
// 					reply_id: id,
// 					thread_id: thread.root_post ? `thread_${thread.root_post.id}` : `thread_unknown`,
// 					username: thread.username,
// 					parent_reply_id: thread.replied_to
// 						? isRoot
// 							? `thread_${thread.replied_to.id}`
// 							: makeReplyID(thread.replied_to.id)
// 						: null,
// 					media: thread,
// 					insights: null,
// 					type: "reply",
// 				};
// 			}),
// 		);
// 	});
// };

export default {
	getThreadInsights: async (id: ReplyID) => {
		return await db.replies.get(id).then((data) => data?.insights);
	},

	getThreadReplies: async (id: ReplyID) => {
		return await db.replies.filter((data) => data.parent_reply_id === id).toArray();
	},

	getThreadMedia: async (id: ReplyID) => {
		return await db.replies.get(id).then((data) => data?.media);
	},

	loadUserRepliesData,

	refreshThreadsLastNDays: async (ky: KyInstance, token: AccessTokenResponse, days = 2) => {
		await loadUserRepliesData(ky, token, { since: `${Math.round((Date.now() - 1000 * 60 * 60 * 24 * days) / 1000)}` }, true);
	},

	clearThreads: () => {
		void db.replies.clear();
	},
	loadReplyInsightsData,
	// loadAllReplyInsightsData,
};

/// check if unthread.me/thread_store exists in local storage
// if it does, delete it
