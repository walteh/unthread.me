import ky, { KyInstance } from "ky";
import { useEffect, useMemo } from "react";
import { create } from "zustand";
import { combine, createJSONStorage, devtools, persist } from "zustand/middleware";

import {
	AccessTokenResponse,
	BreakdownMetricTypeMap,
	ConversationResponse,
	MediaMetricTypeMap,
	MetricTypeMap,
	ThreadMedia,
	UserProfileResponse,
	UserThreadsResponse,
} from "./api";

interface PersistantStore {
	access_token: AccessTokenResponse | null;
	access_token_expires_at: number | null;

	updateAccessToken: (access_token: AccessTokenResponse) => void;
}

export const usePersistantStore = create<PersistantStore>()(
	devtools(
		persist(
			(set) => ({
				access_token: null,
				access_token_expires_at: null,

				updateAccessToken: (access_token: AccessTokenResponse) => {
					set({ access_token, access_token_expires_at: Date.now() + 60 * 60 * 1000 }); // 1 hour
				},
			}),
			{
				name: "threadsole/threads-api",
				storage: createJSONStorage(() => localStorage),
			},
		),
	),
);

interface UserDataTypes {
	user_profile: UserProfileResponse;
	user_insights: MetricTypeMap;
	user_threads: UserThreadsResponse;
	user_follower_demographics: BreakdownMetricTypeMap;
	user_threads_replies: ConversationResponse;
	user_threads_insights: MediaMetricTypeMap;
}

interface DataResponse<T extends keyof UserDataTypes> {
	data: UserDataTypes[T] | null;
	is_loading: boolean;
	updated_at?: number;
	error: string | null;
}

interface UserDataStoreData {
	user_profile: DataResponse<"user_profile"> | null;
	user_insights: DataResponse<"user_insights"> | null;
	user_threads: DataResponse<"user_threads"> | null;
	user_threads_replies: Record<string, DataResponse<"user_threads_replies"> | null>;
	user_threads_insights: Record<string, DataResponse<"user_threads_insights"> | null>;
	user_follower_demographics: DataResponse<"user_follower_demographics"> | null;
}

export const useUserDataStore = create(
	devtools(
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
					updateNestedData: <G extends keyof UserDataTypes, T extends UserDataTypes[G]>(key: G, data: Record<string, T>) => {
						const obj: Record<string, DataResponse<G>> = {};
						for (const [k, v] of Object.entries(data)) {
							obj[k] = {
								data: v,
								is_loading: false,
								updated_at: Date.now(),
								error: null,
							};
						}
						set(() => ({
							[key]: obj,
						}));
					},

					updateData: <G extends keyof UserDataTypes, T extends UserDataTypes[G]>(key: G, data: T) => {
						set((state) => ({
							[key]: {
								...state[key],
								data,
								updated_at: Date.now(),
							},
						}));
					},

					updateIsLoading: (key: keyof UserDataTypes, is_loading: boolean) => {
						set((state) => ({
							[key]: {
								...state[key],
								is_loading,
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
				};
			},
		),
	),
);

export const useDataFetcher = <G extends keyof UserDataStoreData = keyof UserDataStoreData>(
	storeKey: G,
	func: (kyd: KyInstance, ktoken: AccessTokenResponse) => Promise<UserDataTypes[G]>,
) => {
	const data = useUserDataStore((state) => state[storeKey]);
	const setData = useUserDataStore((state) => state.updateData);
	const setLoading = useUserDataStore((state) => state.updateIsLoading);
	const setError = useUserDataStore((state) => state.updateError);

	const accessToken = usePersistantStore((state) => state.access_token);

	useEffect(() => {
		async function fetchData(token: AccessTokenResponse) {
			setLoading(storeKey, true);
			try {
				const kyd = ky.create({ prefixUrl: "https://graph.threads.net" });
				const response = await func(kyd, token);
				setData(storeKey, response);
			} catch (error) {
				console.error(`Error fetching data for ${storeKey}:`, error);
				setError(storeKey, `Failed to fetch data for ${storeKey}`);
			} finally {
				setLoading(storeKey, false);
			}
		}

		if (accessToken && !data) {
			void fetchData(accessToken);
		}
	}, [accessToken, storeKey, func, setData, setLoading, setError, data]);

	return null;
};

export const useNestedDataFetcher = <G extends keyof UserDataStoreData = keyof UserDataStoreData>(
	storeKey: G,
	func: (kyd: KyInstance, ktoken: AccessTokenResponse, id: string) => Promise<UserDataTypes[G]>,
) => {
	const data = useUserDataStore((state) => state.user_threads);
	// const nested_data = useUserDataStore((state) => state[storeKey]);
	const setData = useUserDataStore((state) => state.updateNestedData);

	const accessToken = usePersistantStore((state) => state.access_token);

	useEffect(() => {
		async function fetchData(token: AccessTokenResponse) {
			try {
				const kyd = ky.create({ prefixUrl: "https://graph.threads.net" });

				const requests: Promise<{ id: string; req: UserDataTypes[G] }>[] = [];
				for (const i of data?.data?.data ?? []) {
					requests.push(
						func(kyd, token, i.id).then((req) => {
							return { id: i.id, req };
						}),
					);
				}

				const response = await Promise.all(requests);

				const map: Record<string, UserDataTypes[G]> = {};
				for (const i of response) {
					map[i.id] = i.req;
				}

				setData(storeKey, map);
			} catch (error) {
				console.error(`Error fetching data for ${storeKey}:`, error);
			}
		}

		if (accessToken && data) {
			void fetchData(accessToken);
		}
	}, [accessToken, storeKey, func, setData, data]);

	return null;
};

export const useUserLikesByDay = (): { timestamp: string; total_value: number }[] => {
	const userThreadsInsights = useUserDataStore((state) => state.user_threads_insights);
	const userThreads = useUserDataStore((state) =>
		state.user_threads?.data?.data.reduce((acc, val) => ({ ...acc, [val.id]: val }), {} as Record<string, ThreadMedia>),
	);

	return useMemo(() => {
		if (!userThreads) return [];

		const likesByDay: Record<string, number> = {};

		Object.keys(userThreadsInsights).forEach((key) => {
			const insightsData = userThreadsInsights[key]?.data;
			if (!insightsData?.likes) return;
			const day = new Date(userThreads[key].timestamp).toLocaleDateString();
			if (!likesByDay[day]) likesByDay[day] = 0;
			likesByDay[day] += insightsData.likes.values[0].value;
		});

		console.log(likesByDay);

		return Object.keys(likesByDay)
			.map((day) => ({
				timestamp: day,
				total_value: likesByDay[day],
			}))
			.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
	}, [userThreads, userThreadsInsights]);
};

export const useUserThreadViewsByDay = (): { timestamp: string; total_value: number }[] => {
	const userThreadsInsights = useUserDataStore((state) => state.user_threads_insights);
	const userThreads = useUserDataStore((state) =>
		state.user_threads?.data?.data.reduce((acc, val) => ({ ...acc, [val.id]: val }), {} as Record<string, ThreadMedia>),
	);

	return useMemo(() => {
		if (!userThreads) return [];

		const viewsByDay: Record<string, number> = {};

		Object.keys(userThreadsInsights).forEach((key) => {
			const insightsData = userThreadsInsights[key]?.data;
			if (!insightsData?.views) return;
			const day = new Date(userThreads[key].timestamp).toLocaleDateString();
			if (!viewsByDay[day]) viewsByDay[day] = 0;
			viewsByDay[day] += insightsData.views.values[0].value;
		});

		return Object.keys(viewsByDay)
			.map((day) => ({
				timestamp: day,
				total_value: viewsByDay[day],
			}))
			.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
	}, [userThreads, userThreadsInsights]);
};

interface InMemoryStore {
	is_logging_in: boolean;

	updateIsLoggingIn: (is_logging_in: boolean) => void;
}

export const useInMemoryStore = create(
	devtools<InMemoryStore>((set) => ({
		is_logging_in: false,

		updateIsLoggingIn: (is_logging_in: boolean) => {
			set({ is_logging_in });
		},
	})),
);
