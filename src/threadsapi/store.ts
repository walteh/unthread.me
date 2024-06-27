import ky, { KyInstance } from "ky";
import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { AccessTokenResponse, MetricTypeMap, UserInsightsResponse, UserProfileResponse, UserThreadsResponse } from "./api";

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
	user_insights_profile_views: UserInsightsResponse<MetricTypeMap["views"]>;
	user_threads: UserThreadsResponse;
}

interface DataResponse<T extends keyof UserDataTypes> {
	data: UserDataTypes[T] | null;
	is_loading: boolean;
	updated_at?: number;
	error: string | null;
}

interface UserDataStoreData {
	user_profile: DataResponse<"user_profile"> | null;
	user_insights_profile_views: DataResponse<"user_insights_profile_views"> | null;
	user_threads: DataResponse<"user_threads"> | null;
}

interface UserDataStore extends UserDataStoreData {
	updateData: <G extends keyof UserDataTypes, T extends UserDataTypes[G]>(key: G, data: T) => void;
	updateIsLoading: (key: keyof UserDataStoreData, is_loading: boolean) => void;
	updateError: (key: keyof UserDataStoreData, error: string) => void;
}

export const useUserDataStore = create<UserDataStore>()(
	devtools<UserDataStore>((set) => ({
		user_profile: null,
		user_insights_profile_views: null,
		user_threads: null,

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
	})),
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
