import Dexie, { type EntityTable } from "dexie";
import { KyInstance } from "ky";

import get_conversation from "@src/threadsapi/get_conversation";
import get_media_insights from "@src/threadsapi/get_media_insights";
import { fetch_user_threads_page, GetUserThreadsParams } from "@src/threadsapi/get_user_threads";

import { AccessTokenResponse, ConversationResponse, SimplifedMediaMetricTypeMap, ThreadMedia } from "../threadsapi/types";

export interface CachedThreadData {
	thread_id: ThreadID;
	media: ThreadMedia;
	replies: ConversationResponse | null;
	insights: SimplifedMediaMetricTypeMap | null;
}

export type ThreadID = `thread_${string}`;

function makeThreadID(id: string): ThreadID {
	return `thread_${id}`;
}

function extractThreadID(id: ThreadID): string {
	return id.replace(/^thread_/, "").split("_")[0];
}

const db = new Dexie("unthread.me/thread_store") as Dexie & {
	threads: EntityTable<
		CachedThreadData,
		"thread_id" // primary key "id" (for the typings only)
	>;
};

// Schema declaration:
db.version(1).stores({
	threads: "++thread_id, media, replies, insights", // Primary key and indexed props
});

export { db };

const loadThreadsData = async (ky: KyInstance, token: AccessTokenResponse, params?: GetUserThreadsParams) => {
	const promises: Promise<unknown>[] = [];

	if (localStorage.getItem("unthread.me/thread_store")) {
		localStorage.removeItem("unthread.me/thread_store");
	}
	// let count = 0;
	const fetchAllPages = async (cursor?: string): Promise<void> => {
		const data = await fetch_user_threads_page(ky, token, params, cursor);

		promises.push(
			db.threads.bulkPut(
				data.data.map((thread) => {
					const id = makeThreadID(thread.id);
					return {
						thread_id: id,
						media: thread,
						replies: null,
						insights: null,
					};
				}),
				// {
				// 	allKeys: false,
				// },
			),
		);

		for (const thread of data.data) {
			const thread_id = makeThreadID(thread.id);
			promises.push(loadThreadInsightsData(ky, token, thread_id), loadThreadRepliesData(ky, token, thread_id));
		}

		if (data.paging?.cursors.after && !params?.limit) {
			await fetchAllPages(data.paging.cursors.after);
		}
	};

	await fetchAllPages();
	await Promise.all(promises);
};

const loadThreadInsightsData = async (ky: KyInstance, token: AccessTokenResponse, id: ThreadID) => {
	await get_media_insights(ky, token, extractThreadID(id)).then(async (data) => {
		await db.threads.update(id, { insights: data });
	});
};
const loadThreadRepliesData = async (ky: KyInstance, token: AccessTokenResponse, id: ThreadID) => {
	await get_conversation(ky, token, extractThreadID(id)).then(async (data) => {
		await db.threads.update(id, { replies: data });
	});
};

export default {
	getThreadInsights: async (id: ThreadID) => {
		return await db.threads.get(id).then((data) => data?.insights);
	},

	getThreadReplies: async (id: ThreadID) => {
		return await db.threads.get(id).then((data) => data?.replies);
	},

	getThreadMedia: async (id: ThreadID) => {
		return await db.threads.get(id).then((data) => data?.media);
	},

	loadThreadsData,

	refreshThreadsLast2Days: async (ky: KyInstance, token: AccessTokenResponse) => {
		await loadThreadsData(ky, token, { since: `${Math.round((Date.now() - 1000 * 60 * 60 * 24 * 2) / 1000)}` });
	},

	clearThreads: () => {
		void db.threads.clear();
	},
};

/// check if unthread.me/thread_store exists in local storage
// if it does, delete it
