import { KyInstance } from "ky";
import { create } from "zustand";
import { combine, createJSONStorage, devtools, persist } from "zustand/middleware";

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

export interface UserDataTypes {
	user_profile: UserProfileResponse;
	user_insights: SimplifedMetricTypeMap;
	user_follower_demographics: BreakdownMetricTypeMap;
}

export interface NestedUserDataTypes {
	user_threads_replies: ConversationResponse;
	user_threads_insights: SimplifedMediaMetricTypeMap;
}

interface DataResponse<T extends keyof UserDataTypes> {
	data: UserDataTypes[T] | null;
	is_loading: boolean;
	updated_at?: number;
	error: string | null;
}

interface RawDataResponse<T> {
	data: T | null;
	is_loading: boolean;
	updated_at: number;
	error: string | null;
}

interface NestedDataDataResponse<T extends keyof NestedUserDataTypes> {
	data: NestedUserDataTypes[T];
	is_loading: boolean;
	updated_at: number;
	error: string | null;
}

interface NestedDataResponse<T extends keyof NestedUserDataTypes> {
	data: Record<string, NestedDataDataResponse<T> | null>;
	is_loading: boolean;
	updated_at: number;
	num_loading: number;
	error: string | null;
}

interface UserDataStoreData {
	user_profile: DataResponse<"user_profile"> | null;
	user_insights: DataResponse<"user_insights"> | null;
	user_threads: RawDataResponse<Record<string, ThreadMedia>> | null;
	user_threads_replies: NestedDataResponse<"user_threads_replies"> | null;
	user_threads_insights: NestedDataResponse<"user_threads_insights"> | null;
	user_follower_demographics: DataResponse<"user_follower_demographics"> | null;
}

export const cache_store = create(
	devtools(
		persist(
			combine(
				{
					user_profile: null,
					user_insights: null,
					user_threads: null,
					user_follower_demographics: null,
					user_threads_replies: null,
					user_threads_insights: null,
				} as UserDataStoreData,
				(set) => {
					const loadThreadInsightsData = async (ky: KyInstance, token: AccessTokenResponse, id: string) => {
						try {
							set((state) => ({
								user_threads_insights: {
									...(state.user_threads_insights ??
										({
											data: {},
											is_loading: false,
											updated_at: Date.now(),
											error: null,
											num_loading: 0,
										} as NestedDataResponse<"user_threads_insights">)),
									num_loading: (state.user_threads_insights?.num_loading ?? 0) + 1,
									is_loading: true,
								},
							}));

							const result = await get_media_insights(ky, token, id);

							set((state) => {
								const num_loading = (state.user_threads_insights?.num_loading ?? 0) - 1;
								return {
									user_threads_insights: {
										...state.user_threads_insights,
										data: {
											...state.user_threads_insights?.data,
											[id]: {
												data: result,
												updated_at: Date.now(),
												error: null,
												expired: false,
												is_loading: false,
											},
										},
										num_loading: num_loading,
										is_loading: num_loading !== 0,
										updated_at: Date.now(),
										error: null,
									},
								};
							});
						} catch (error) {
							console.error("Error fetching thread insights:", error);

							set((state) => ({
								user_threads_insights: {
									...state.user_threads_insights,
									data: state.user_threads_insights?.data ?? {},
									is_loading: false,
									updated_at: Date.now(),
									error: null,
									num_loading: (state.user_threads_insights?.num_loading ?? 0) - 1,
								},
							}));
						}
					};

					const loadThreadRepliesData = async (ky: KyInstance, token: AccessTokenResponse, id: string) => {
						try {
							set((state) => ({
								user_threads_replies: {
									...(state.user_threads_replies ?? {
										is_loading: false,
										updated_at: Date.now(),
										error: null,
										expired: false,
										num_loading: 0,
										data: {},
									}),
									num_loading: (state.user_threads_replies?.num_loading ?? 0) + 1,
									data: {
										...(state.user_threads_replies?.data ?? {}),
										[id]: {
											data: {} as ConversationResponse,
											is_loading: true,
											updated_at: Date.now(),
											error: null,
											expired: false,
										},
									},
								},
							}));

							const result = await get_conversation(ky, token, id);

							set((state) => {
								const num_loading = (state.user_threads_replies?.num_loading ?? 0) - 1;
								return {
									user_threads_replies: {
										...state.user_threads_replies,
										data: {
											...state.user_threads_replies?.data,
											[id]: {
												data: result,
												updated_at: Date.now(),
												error: null,
												expired: false,
												is_loading: false,
											},
										},
										num_loading: num_loading,
										is_loading: num_loading !== 0,
										updated_at: Date.now(),
										error: null,
									},
								};
							});
						} catch (error) {
							console.error("Error fetching thread replies:", error);

							set((state) => ({
								user_threads_replies: {
									...state.user_threads_replies,
									data: state.user_threads_replies?.data ?? {},
									is_loading: false,
									updated_at: Date.now(),
									error: null,
									num_loading: (state.user_threads_replies?.num_loading ?? 0) - 1,
								},
							}));
						}
					};

					return {
						updateNestedData: <G extends keyof NestedUserDataTypes, T extends NestedUserDataTypes[G]>(
							key: G,
							id: string,
							data: T,
						) => {
							set((state) => ({
								[key]: {
									...state[key],
									data: {
										...state[key]?.data,
										[id]: {
											data,
											is_loading: false,
											updated_at: Date.now(),
											error: null,
											expired: false,
										},
									},
								},
							}));
						},

						updateAllNestedData: <G extends keyof NestedUserDataTypes, T extends NestedUserDataTypes[G]>(
							key: G,
							data: Record<string, T>,
						) => {
							const newData: Record<string, NestedDataDataResponse<G>> = {};
							Object.keys(data).forEach((id) => {
								newData[id] = {
									data: data[id],
									is_loading: false,
									updated_at: Date.now(),
									error: null,
								};
							});
							set((state) => ({
								[key]: {
									...state[key],
									data: newData,
									is_loading: false,
									updated_at: Date.now(),
									error: null,
								},
							}));
						},

						updateData: <G extends keyof UserDataTypes, T extends UserDataTypes[G]>(key: G, data: T) => {
							set((state) => ({
								[key]: {
									...state[key],
									data,
									updated_at: Date.now(),
									error: null,
								},
							}));
						},

						updateIsLoading: (key: keyof UserDataTypes, is_loading: boolean) => {
							set((state) => ({
								[key]: {
									...state[key],
									is_loading,
									error: null,
								},
							}));
						},

						updateError: (key: keyof UserDataTypes, error: string) => {
							set((state) => ({
								[key]: {
									...state[key],
									error,
								},
							}));
						},

						clearCache: () => {
							set(() => {
								return {
									user_profile: null,
									user_insights: null,
									user_threads: null,
									user_follower_demographics: null,
									user_threads_replies: null,
									user_threads_insights: null,
								};
							});
						},

						// updateThreadData: (data: Record<string, ThreadMedia>) => {
						// 	set((state) => {
						// 		const newData = { ...state.user_threads?.data, ...data };

						// 		return {
						// 			user_threads: {
						// 				...state.user_threads,
						// 				data: newData,
						// 				is_loading: false,
						// 				updated_at: Date.now(),
						// 				error: null,
						// 				num_loaded: Object.keys(data).length,
						// 				expired: false,
						// 			},
						// 		};
						// 	});
						// },

						loadThreadsData: (ky: KyInstance, token: AccessTokenResponse, params?: GetUserThreadsParams) => {
							const fetchAllPages = async (cursor?: string): Promise<void> => {
								try {
									const response = await fetch_user_threads_page(ky, token, params, cursor);

									set((state) => ({
										user_threads: {
											data: {
												...state.user_threads?.data,
												...response.data.reduce<Record<string, ThreadMedia>>((acc, thread) => {
													acc[thread.id] = thread;
													return acc;
												}, {}),
											},
											// num_loaded: state.user_threads.num_loaded + response.data.length,
											is_loading: response.paging?.cursors.after ? true : false,
											updated_at: Date.now(),
											error: null,
										},
									}));

									const help = () => {
										for (const thread of response.data) {
											// run in batches of 5

											void loadThreadRepliesData(ky, token, thread.id);
											void loadThreadInsightsData(ky, token, thread.id);
										}
									};

									help();

									if (response.paging?.cursors.after) {
										await fetchAllPages(response.paging.cursors.after);
									}
								} catch (error) {
									console.error("Error fetching user threads:", error);

									set((state) => ({
										user_threads: {
											// ...state.user_threads,
											data: state.user_threads?.data ?? null,
											// num_loaded: 0,
											is_loading: false,
											updated_at: Date.now(),
											error: "Failed to fetch user threads",
											expired: false,
										},
									}));
								}
							};

							set((state) => ({
								user_threads: {
									data: state.user_threads?.data ?? null,
									is_loading: true,
									error: null,
									expired: false,
									num_loaded: 0,
									updated_at: Date.now(),
								},
							}));

							void fetchAllPages();
						},
					};
				},
			),
			{
				name: "unthread.me/cache_store",
				storage: createJSONStorage(() => localStorage),
				version: 6,
			},
		),
	),
);

export default cache_store;
