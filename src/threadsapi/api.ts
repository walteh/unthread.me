import { KyInstance } from "ky";

export const getAuthorizationStartURL = (state?: string): URL => {
	const client_id = import.meta.env.VITE_UNTHREADME_THREADS_API_APP_ID as string;

	if (!client_id) {
		throw new Error("Client ID not found");
	}

	const current_host = window.location.origin;

	const authUrl = new URL("https://threads.net/oauth/authorize");
	authUrl.searchParams.append("client_id", client_id);
	authUrl.searchParams.append("redirect_uri", current_host);
	authUrl.searchParams.append("scope", "threads_basic");
	authUrl.searchParams.append("response_type", "code");

	if (state) {
		authUrl.searchParams.append("state", state);
	}

	return authUrl;
};

export interface AccessTokenResponse {
	access_token: string;
	user_id: number;
}

export const exchangeCodeForAccessToken = async (inst: KyInstance, code: string): Promise<AccessTokenResponse> => {
	return await inst
		.post("beta/threads-api-oauth-proxy", {
			searchParams: {
				code: code,
			},
			headers: {
				"Content-Type": "application/json",
			},

			// mode: "no-cors",
			timeout: 10000,
		})

		.then((data) => {
			console.log({ data });
			return data.json<AccessTokenResponse>();
		})
		.catch((error: unknown) => {
			console.error("Error fetching access token:", error);
			throw error;
		});
};

export interface UserProfileResponse {
	id: string;
	username: string;
	threads_profile_picture_url: string;
	threads_biography: string;
}

export const getUserProfile = async (inst: KyInstance, accessToken: AccessTokenResponse): Promise<UserProfileResponse> => {
	return await inst
		.get(`v1.0/${accessToken.user_id}`, {
			searchParams: {
				fields: "id,username,threads_profile_picture_url,threads_biography",
				access_token: accessToken.access_token,
			},
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
		})
		.then((response) => {
			console.log({ response });
			return response.json<UserProfileResponse>();
		})
		.catch((error: unknown) => {
			console.error("Error fetching user profile:", error);
			throw error;
		});
};

export interface UserInsightsResponse<T extends InsightMetric = InsightMetric> {
	data: T[];
}

export type InsightMetric = TotalValueMetric | TimeSeriesMetric;

export interface TotalValueMetric {
	name: string;
	period: string;
	total_value: { value: number };
	title: string;
	description: string;
	id: string;
}

export interface TimeSeriesMetric {
	name: string;
	period: string;
	values: { value: number; end_time: string }[];
	title: string;
	description: string;
	id: string;
}

// country, city, age, or gender.
type Breakdown = "country" | "city" | "age" | "gender";

export interface GetUserInsightsParams {
	since?: number;
	until?: number;
	breakdown?: Breakdown;
	all_time?: boolean;
}

export interface MetricTypeMap {
	views: TimeSeriesMetric;
	likes: TotalValueMetric;
	replies: TotalValueMetric;
	reposts: TotalValueMetric;
	quotes: TotalValueMetric;
	followers_count: TotalValueMetric;
	follower_demographics: TotalValueMetric;
}

export type Metric = keyof MetricTypeMap;

export const getUserInsights = async <M extends Metric>(
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	metric: M,
	{ since, until, breakdown, all_time }: GetUserInsightsParams = {},
): Promise<UserInsightsResponse<MetricTypeMap[M]>> => {
	const searchParams: Record<string, string | number> = {
		metric: metric,
		access_token: accessToken.access_token,
	};

	if (all_time) {
		searchParams.since = 1712991600; // from the docs
		searchParams.until = Math.floor(Date.now() / 1000);
	} else {
		if (since) searchParams.since = since;
		if (until) searchParams.until = until;
	}

	if (metric === "follower_demographics") searchParams.breakdown = breakdown ?? "city";

	return await inst
		.get(`v1.0/${accessToken.user_id}/threads_insights`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
		})
		.then((response) => response.json<UserInsightsResponse<MetricTypeMap[M]>>())
		.catch((error: unknown) => {
			console.error("Error fetching user insights:", error);
			throw error;
		});
};

// Wrapper functions
export const getViewsInsights = async (inst: KyInstance, accessToken: AccessTokenResponse) => {
	return await getUserInsights(inst, accessToken, "views", { all_time: true });
};

export const getLikesInsights = async (inst: KyInstance, accessToken: AccessTokenResponse) => {
	return await getUserInsights(inst, accessToken, "likes", { all_time: true });
};

export const getRepliesInsights = async (inst: KyInstance, accessToken: AccessTokenResponse) => {
	return await getUserInsights(inst, accessToken, "replies", { all_time: true });
};

export const getRepostsInsights = async (inst: KyInstance, accessToken: AccessTokenResponse) => {
	return await getUserInsights(inst, accessToken, "reposts", { all_time: true });
};

export const getQuotesInsights = async (inst: KyInstance, accessToken: AccessTokenResponse) => {
	return await getUserInsights(inst, accessToken, "quotes", { all_time: true });
};

export const getFollowersCountInsights = async (inst: KyInstance, accessToken: AccessTokenResponse) => {
	return await getUserInsights(inst, accessToken, "followers_count");
};

export const getFollowerDemographicsInsights = async (inst: KyInstance, accessToken: AccessTokenResponse, breakdown: Breakdown) => {
	return await getUserInsights(inst, accessToken, "follower_demographics", { breakdown });
};
