import React from "react";
import ky from "ky";
import { AccessTokenResponse, getUserInsights, UserInsightsResponse } from "@src/threadsapi/api";
import useStore from "@src/threadsapi/store";

const useUserInsights = () => {
	const [insights, setInsights] = React.useState<UserInsightsResponse | null>(null);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string | null>(null);
	const accessToken = useStore((state) => state.access_token);

	React.useEffect(() => {
		async function fetchUserInsights(token: AccessTokenResponse) {
			setIsLoading(true);
			try {
				const kyd = ky.create({ prefixUrl: "https://graph.threads.net" });
				const userInsights: UserInsightsResponse = await getUserInsights(
					kyd,
					token,
					"views,likes,replies,reposts,quotes,followers_count,follower_demographics",
				);
				setInsights(userInsights);
				setError(null);
			} catch (error) {
				console.error("Error fetching user insights:", error);
				setError("Failed to fetch user insights");
			} finally {
				setIsLoading(false);
			}
		}

		if (accessToken) {
			void fetchUserInsights(accessToken);
		}
	}, [accessToken]);

	return [insights, isLoading, error] as const;
};

export default useUserInsights;
