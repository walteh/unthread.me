import ky, { KyInstance } from "ky";
import { useEffect } from "react";

import { AccessTokenResponse } from "@src/threadsapi/types";

import { NestedUserDataTypes, UserDataTypes } from "../cache_store";
import useCacheStore from "./useCacheStore";
import { useIsLoggedIn } from "./useIsLoggedIn";

export const useThreadsAPIExirationUpdater = () => {
	const mark = useCacheStore((state) => state.markAsExpired);

	useEffect(() => {
		const intervalId = setInterval(mark, 1000 * 60 * 10);

		return () => {
			clearInterval(intervalId);
		};
	}, [mark]);
};

export const useThreadsAPIUserDataUpdater = <G extends keyof UserDataTypes = keyof UserDataTypes>(
	storeKey: G,
	func: (kyd: KyInstance, ktoken: AccessTokenResponse) => Promise<UserDataTypes[G]>,
) => {
	const data = useCacheStore((state) => state[storeKey]);
	const setData = useCacheStore((state) => state.updateData);
	const setLoading = useCacheStore((state) => state.updateIsLoading);
	const setError = useCacheStore((state) => state.updateError);

	const [isLoggedIn, accessToken] = useIsLoggedIn();

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

		if (isLoggedIn && (!data || data.expired)) {
			void fetchData(accessToken);
		}
	}, [isLoggedIn, accessToken, storeKey, func, setData, setLoading, setError, data]);

	return null;
};

export const useThreadsAPIMediaDataUpdater = <G extends keyof NestedUserDataTypes = keyof NestedUserDataTypes>(
	storeKey: G,
	func: (kyd: KyInstance, ktoken: AccessTokenResponse, id: string) => Promise<NestedUserDataTypes[G]>,
) => {
	const userThreadsData = useCacheStore((state) => state.user_threads);

	const myData = useCacheStore((state) => state[storeKey]);
	// const nested_data = useCacheStore((state) => state[storeKey]);
	const setData = useCacheStore((state) => state.updateNestedData);

	const [isLoggedIn, accessToken] = useIsLoggedIn();

	useEffect(() => {
		async function fetchData(token: AccessTokenResponse) {
			try {
				const kyd = ky.create({ prefixUrl: "https://graph.threads.net" });

				const requests: Promise<{ id: string; req: NestedUserDataTypes[G] }>[] = [];
				for (const i of userThreadsData?.data?.data ?? []) {
					requests.push(
						func(kyd, token, i.id).then((req) => {
							return { id: i.id, req };
						}),
					);
				}

				const response = await Promise.all(requests);

				const map: Record<string, NestedUserDataTypes[G]> = {};
				for (const i of response) {
					map[i.id] = i.req;
				}

				setData(storeKey, map);
			} catch (error) {
				console.error(`Error fetching data for ${storeKey}:`, error);
			}
		}

		if (isLoggedIn && userThreadsData?.data && (!myData || myData.expired)) {
			void fetchData(accessToken);
		}
	}, [isLoggedIn, accessToken, storeKey, func, setData, userThreadsData, myData]);

	return null;
};
