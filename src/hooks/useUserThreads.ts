import ky from "ky";
import React from "react";

import { AccessTokenResponse, getUserThreads, GetUserThreadsParams, ThreadMedia, UserThreadsResponse } from "@src/threadsapi/api"; // Update with your actual API import
import { usePersistantStore } from "@src/threadsapi/store"; // Update with your actual store import

const useUserThreads = (params?: GetUserThreadsParams) => {
	const [threads, setThreads] = React.useState<ThreadMedia[] | null>(null);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string | null>(null);
	const accessToken = usePersistantStore((state) => state.access_token);

	React.useEffect(() => {
		async function fetchUserThreads(token: AccessTokenResponse) {
			setIsLoading(true);
			try {
				const kyd = ky.create({ prefixUrl: "https://graph.threads.net" });
				const userThreads: UserThreadsResponse = await getUserThreads(kyd, token, params);
				setThreads(userThreads.data);
				setError(null);
			} catch (error) {
				console.error("Error fetching user threads:", error);
				setError("Failed to fetch user threads");
			} finally {
				setIsLoading(false);
			}
		}

		if (accessToken) {
			void fetchUserThreads(accessToken);
		}
	}, [accessToken, params]);

	return [threads, isLoading, error] as const;
};

export default useUserThreads;
