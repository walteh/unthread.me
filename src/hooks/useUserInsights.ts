// import {
// 	AccessTokenResponse,
// 	getUserInsights,
// 	GetUserInsightsParams,
// 	Metric,
// 	MetricTypeMap,
// 	UserInsightsResponse,
// } from "@src/threadsapi/api";
// import { usePersistantStore } from "@src/threadsapi/store";

// const useUserInsights = <M extends Metric>(metric: M, params?: GetUserInsightsParams) => {
// 	const [insights, setInsights] = React.useState<UserInsightsResponse<MetricTypeMap[M]> | null>(null);
// 	const [isLoading, setIsLoading] = React.useState<boolean>(false);
// 	const [error, setError] = React.useState<string | null>(null);
// 	const accessToken = usePersistantStore((state) => state.access_token);

// 	React.useEffect(() => {
// 		async function fetchUserInsights(token: AccessTokenResponse) {
// 			setIsLoading(true);
// 			try {
// 				console.log({ metric, params });
// 				const kyd = ky.create({ prefixUrl: "https://graph.threads.net" });
// 				const userInsights: UserInsightsResponse<MetricTypeMap[M]> = await getUserInsights(kyd, token, metric, params);
// 				setInsights(userInsights);
// 				setError(null);
// 			} catch (error) {
// 				console.error("Error fetching user insights:", error);
// 				setError("Failed to fetch user insights");
// 			} finally {
// 				setIsLoading(false);
// 			}
// 		}

// 		if (accessToken && !insights && !error && !isLoading) {
// 			void fetchUserInsights(accessToken);
// 		}
// 	}, [accessToken, metric, params, error, isLoading, insights]);

// 	return [insights, isLoading, error] as const;
// };

// export default useUserInsights;
