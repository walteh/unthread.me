import { create } from "zustand";
import { combine, createJSONStorage, devtools, persist } from "zustand/middleware";

import {
	BreakdownMetricTypeMap,
	ConversationResponse,
	MediaMetricTypeMap,
	MetricTypeMap,
	UserProfileResponse,
	UserThreadsResponse,
} from "../threadsapi/types";

export interface UserDataTypes {
	user_profile: UserProfileResponse;
	user_insights: MetricTypeMap;
	user_threads: UserThreadsResponse;
	user_follower_demographics: BreakdownMetricTypeMap;
}

export interface NestedUserDataTypes {
	user_threads_replies: ConversationResponse;
	user_threads_insights: MediaMetricTypeMap;
}

interface DataResponse<T extends keyof UserDataTypes> {
	data: UserDataTypes[T] | null;
	is_loading: boolean;
	updated_at?: number;
	error: string | null;
	expired: boolean;
}

interface NestedDataResponse<T extends keyof NestedUserDataTypes> {
	data: Record<string, NestedUserDataTypes[T] | null>;
	is_loading: boolean;
	updated_at: number;
	error: string | null;
	expired: boolean;
}

interface UserDataStoreData {
	user_profile: DataResponse<"user_profile"> | null;
	user_insights: DataResponse<"user_insights"> | null;
	user_threads: DataResponse<"user_threads"> | null;
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
					user_threads_replies: {},
					user_threads_insights: {},
				} as UserDataStoreData,
				(set) => {
					return {
						updateNestedData: <G extends keyof NestedUserDataTypes, T extends NestedUserDataTypes[G]>(
							key: G,
							data: Record<string, T>,
						) => {
							// const obj: Record<string, DataResponse<G>> = {};
							// for (const [k, v] of Object.entries(data)) {
							// 	obj[k] = {
							// 		data: v,
							// 		is_loading: false,
							// 		updated_at: Date.now(),
							// 		error: null,
							// 	};
							// }
							set(() => ({
								[key]: {
									data,
									is_loading: false,
									updated_at: Date.now(),
									expired: false,
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
									expired: false,
								},
							}));
						},

						updateIsLoading: (key: keyof UserDataTypes, is_loading: boolean) => {
							set((state) => ({
								[key]: {
									...state[key],
									is_loading,
									expired: false,
								},
							}));
						},

						updateError: (key: keyof UserDataTypes, error: string) => {
							set((state) => ({
								[key]: {
									...state[key],
									error,
									expired: false,
								},
							}));
						},

						markAsExpired: () => {
							set((state) => {
								const newState = { ...state };
								Object.keys(newState).forEach((key) => {
									const keyd = key as keyof UserDataStoreData;
									if (typeof newState[keyd] === "object" && newState[keyd] !== null) {
										newState[keyd].expired = true;
									}
								});
								return newState;
							});
						},
					};
				},
			),
			{
				name: "unthread.me/cache_store",
				storage: createJSONStorage(() => localStorage),
			},
		),
	),
);

export default cache_store;
