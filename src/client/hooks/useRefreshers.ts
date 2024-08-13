import ky from "ky";
import { useCallback, useState } from "react";

import { AccessTokenResponse } from "@src/threadsapi/types";

import reply_store from "../reply_store";
import thread_store from "../thread_store";
import useCacheStore from "./useCacheStore";
import { useIsLoggedIn } from "./useIsLoggedIn";

const kyd = ky.create({ prefixUrl: "https://graph.threads.net" });

export const useLast2DaysThreadsRefresher = () => {
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [isLoggedIn, accessToken] = useIsLoggedIn();
	// const refresh = useCacheStore((state) => state.loadUserData);

	const caller = useCallback(() => {
		async function fetchData(token: AccessTokenResponse) {
			setLoading(true);
			try {
				await Promise.all([
					// refresh(kyd, token),
					thread_store.refreshThreadsLast2Days(kyd, token),
					reply_store.refreshThreadsLast2Days(kyd, token),
				]);
				setError(null);
			} catch (error) {
				console.error(`problem fetching last 2 days threads:`, error);
				setError(`failed to fetch last 2 days threads - ${error}`);
				alert(`failed to fetch user data - ${error}`);
			} finally {
				setLoading(false);
			}
		}

		if (isLoggedIn) {
			void fetchData(accessToken);
		}

		return;
	}, [isLoggedIn, accessToken, setLoading, setError]);

	return [caller, isLoading, error] as const;
};

export const useAllThreadsRefresher = () => {
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [isLoggedIn, accessToken] = useIsLoggedIn();

	const caller = useCallback(() => {
		async function fetchData(token: AccessTokenResponse) {
			setLoading(true);
			try {
				await Promise.all([
					thread_store.loadThreadsData(kyd, token, {}, true),
					reply_store.loadUserRepliesData(kyd, token, {}, true),
				]);
				setError(null);
			} catch (error) {
				console.error(`problem fetching all threads:`, error);
				setError(`failed to fetch all threads - ${error}`);
				alert(`failed to fetch user data - ${error}`);
			} finally {
				setLoading(false);
			}
		}

		if (isLoggedIn) {
			void fetchData(accessToken);
		}

		return;
	}, [isLoggedIn, accessToken, setLoading, setError]);

	return [caller, isLoading, error] as const;
};

// export const useAllInsightsRefresher = () => {
// 	const [isLoading, setLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);

// 	const [isLoggedIn, accessToken] = useIsLoggedIn();

// 	const caller = useCallback(() => {
// 		async function fetchData(token: AccessTokenResponse) {
// 			setLoading(true);
// 			try {
// 				await loadAllThreadInsightsData(kyd, token);
// 				setError(null);
// 			} catch (error) {
// 				console.error(`problem fetching all insights:`, error);
// 				setError(`failed to fetch all insights - ${error}`);
// 				alert(`failed to fetch user data - ${error}`);
// 			} finally {
// 				setLoading(false);
// 			}
// 		}

// 		if (isLoggedIn) {
// 			void fetchData(accessToken);
// 		}

// 		return;
// 	}, [isLoggedIn, accessToken, setLoading, setError]);

// 	return [caller, isLoading, error] as const;
// };

export const useUserDataRefresher = () => {
	const refresh = useCacheStore((state) => state.loadUserData);
	const [isLoading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [isLoggedIn, accessToken] = useIsLoggedIn();

	const caller = useCallback(() => {
		async function fetchData(token: AccessTokenResponse) {
			setLoading(true);
			try {
				await refresh(kyd, token);
				setError(null);
			} catch (error) {
				console.error(`problem fetching user data:`, error);
				setError(`failed to fetch user data - ${error}`);
				alert(`failed to fetch user data - ${error}`);
			} finally {
				setLoading(false);
			}
		}

		if (isLoggedIn) {
			void fetchData(accessToken);
		}

		return;
	}, [isLoggedIn, accessToken, refresh, setLoading, setError]);

	return [caller, isLoading, error] as const;
};
