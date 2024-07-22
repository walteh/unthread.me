import { KyInstance } from "ky";
import { create } from "zustand";
import { combine, createJSONStorage, devtools, persist } from "zustand/middleware";

import threadsapi from "@src/threadsapi";
import get_conversation from "@src/threadsapi/get_conversation";
import get_media_insights from "@src/threadsapi/get_media_insights";
import { fetch_user_threads_page, GetUserThreadsParams } from "@src/threadsapi/get_user_threads";

import {
	AccessTokenResponse,
	BreakdownMetricTypeMap,
	ConversationResponse,
	SimplifedMediaMetricTypeMap,
	SimplifedMetricTypeMap,
	ThreadMedia,
	UserProfileResponse,
} from "../threadsapi/types";

export interface CachedThreadData {
	id: ThreadID;
	media: ThreadMedia;
	replies: ConversationResponse | null;
	insights: SimplifedMediaMetricTypeMap | null;
}

export type ThreadID = `thread_${string}`;

function makeThreadID(id: string): ThreadID {
	return `thread_${id}`;
}

function extractThreadID(id: ThreadID): string {
	return id.replace(/^thread_/, "");
}

interface CacheStoreState {
	user_profile: UserProfileResponse | null;
	user_insights: SimplifedMetricTypeMap | null;
	user_follower_demographics: BreakdownMetricTypeMap | null;
	user_threads: Record<ThreadID, CachedThreadData>;
	user_profile_refreshed_at: number;
}

export const cache_store = create(
	devtools(
		persist(
			combine(
				{
					user_profile_refreshed_at: 0,
					user_profile: null,
					user_insights: null,
					user_follower_demographics: null,
					user_threads: {},
				} as CacheStoreState,
				(set, get) => {
					const loadThreadsData = async (ky: KyInstance, token: AccessTokenResponse, params?: GetUserThreadsParams) => {
						const promises: Promise<void>[] = [];
						// let count = 0;
						const fetchAllPages = async (cursor?: string): Promise<void> => {
							const [response, paging] = await fetch_user_threads_page(ky, token, params, cursor).then((data) => {
								set((state) => {
									for (const thread of data.data) {
										const id = makeThreadID(thread.id);
										// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
										if (!state.user_threads[id]) {
											state.user_threads[id] = {
												id,
												media: thread,
												replies: null,
												insights: null,
											};
										} else {
											state.user_threads[id].id = id;
											state.user_threads[id].media = thread;
										}
									}
									return state;
								});

								return [data.data.map((thread) => makeThreadID(thread.id)), data.paging] as const;
							});

							for (const thread of response) {
								promises.push(loadThreadRepliesData(ky, token, thread));
								promises.push(loadThreadInsightsData(ky, token, thread));
							}

							if (paging?.cursors.after && !params?.limit) {
								await fetchAllPages(paging.cursors.after);
							}
						};

						await fetchAllPages();
						await Promise.all(promises);
					};
					const loadThreadInsightsData = async (ky: KyInstance, token: AccessTokenResponse, id: ThreadID) => {
						await get_media_insights(ky, token, extractThreadID(id)).then((data) => {
							set((state) => {
								state.user_threads[id].insights = data;
								return state;
							});
						});
					};
					const loadThreadRepliesData = async (ky: KyInstance, token: AccessTokenResponse, id: ThreadID) => {
						await get_conversation(ky, token, extractThreadID(id)).then((data) => {
							set((state) => {
								state.user_threads[id].replies = data;
								return state;
							});
						});
					};

					const loadUserData = async (ky: KyInstance, token: AccessTokenResponse) => {
						const prof = threadsapi.get_user_profile(ky, token).then((data) => {
							set(() => ({
								user_profile: data,
								user_profile_refreshed_at: new Date().getTime(),
							}));
						});

						const ins = threadsapi.get_user_insights(ky, token).then((data) => {
							set(() => ({
								user_insights: data,
							}));
						});

						const dem = threadsapi.get_follower_demographics(ky, token).then((data) => {
							set(() => ({
								user_follower_demographics: data,
							}));
						});

						await Promise.all([prof, ins, dem]);

						return;
					};
					return {
						loadUserData,

						getThreadInsights: (id: ThreadID) => {
							return get().user_threads[id].insights;
						},

						getThreadReplies: (id: ThreadID) => {
							return get().user_threads[id].replies;
						},

						getThreadMedia: (id: ThreadID) => {
							return get().user_threads[id].media;
						},

						clearUserData: () => {
							set(() => {
								return {
									user_profile: null,
									user_insights: null,
									user_follower_demographics: null,
								};
							});
						},

						loadThreadsData,

						refreshThreadsLast2Days: async (ky: KyInstance, token: AccessTokenResponse) => {
							await loadThreadsData(ky, token, { since: `${Math.round((Date.now() - 1000 * 60 * 60 * 24 * 2) / 1000)}` });
						},

						clearThreads: () => {
							set(() => ({
								user_threads: {},
								user_threads_replies: {},
								user_threads_insights: {},
							}));
						},
					};
				},
			),
			{
				name: "unthread.me/cache_store",
				storage: createJSONStorage(() => localStorage),
				version: 10,
			},
		),
	),
);

export default cache_store;
