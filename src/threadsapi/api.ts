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
// export const getViewsInsights = async (inst: KyInstance, accessToken: AccessTokenResponse) => {
// 	return await getUserInsights(inst, accessToken, "views", { all_time: true });
// };

// export const getLikesInsights = async (inst: KyInstance, accessToken: AccessTokenResponse) => {
// 	return await getUserInsights(inst, accessToken, "likes", { all_time: true });
// };

// export const getRepliesInsights = async (inst: KyInstance, accessToken: AccessTokenResponse) => {
// 	return await getUserInsights(inst, accessToken, "replies", { all_time: true });
// };

// export const getRepostsInsights = async (inst: KyInstance, accessToken: AccessTokenResponse) => {
// 	return await getUserInsights(inst, accessToken, "reposts", { all_time: true });
// };

// export const getQuotesInsights = async (inst: KyInstance, accessToken: AccessTokenResponse) => {
// 	return await getUserInsights(inst, accessToken, "quotes", { all_time: true });
// };

// export const getFollowersCountInsights = async (inst: KyInstance, accessToken: AccessTokenResponse) => {
// 	return await getUserInsights(inst, accessToken, "followers_count");
// };

// export const getFollowerDemographicsInsights = async (inst: KyInstance, accessToken: AccessTokenResponse, breakdown: Breakdown) => {
// 	return await getUserInsights(inst, accessToken, "follower_demographics", { breakdown });
// };

export interface ThreadMedia {
	id: string;
	media_product_type: string;
	media_type: string;
	media_url?: string;
	permalink?: string;
	owner: { id: string };
	username: string;
	text?: string;
	timestamp: string;
	shortcode: string;
	thumbnail_url?: string;
	children?: ThreadMedia[];
	is_quote_post: boolean;
}

export interface UserThreadsResponse {
	data: ThreadMedia[];
	paging?: {
		cursors: {
			before: string;
			after: string;
		};
	};
}

export interface GetUserThreadsParams {
	since?: string;
	until?: string;
	limit?: number;
	all_time?: boolean;
}

export const getUserThreads = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	params?: GetUserThreadsParams,
): Promise<UserThreadsResponse> => {
	const searchParams: Record<string, string | number | boolean> = {
		fields: "id,media_product_type,media_type,media_url,permalink,owner,username,text,timestamp,shortcode,thumbnail_url,children,is_quote_post",
		access_token: accessToken.access_token,
	};

	if (params?.all_time) {
		searchParams.since = 1712991600; // from the docs
		searchParams.until = Math.floor(Date.now() / 1000);
	} else {
		if (params?.since) searchParams.since = params.since;
		if (params?.until) searchParams.until = params.until;
	}

	searchParams.limit = params?.limit ?? Number.MAX_SAFE_INTEGER;

	const resp = await inst
		.get(`v1.0/${accessToken.user_id}/threads`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
		})
		.then((response) => response.json<UserThreadsResponse>())
		.catch((error: unknown) => {
			console.error("Error fetching user threads:", error);
			throw error;
		});

	// if (params?.all_time && resp.paging?.cursors.after) {
	// 	const next = resp.paging.cursors.after;
	// 	const more = await getUserThreads(
	// 		inst,
	// 		{
	// 			access_token: next,
	// 			user_id: accessToken.user_id,
	// 		},
	// 		{ ...params, since: next },
	// 	);
	// 	resp.data.push(...more.data);
	// 	resp.paging = more.paging;
	// }

	return resp;
};

export interface Reply {
	id: string;
	text: string;
	timestamp: string;
	media_product_type: string;
	media_type: string;
	media_url?: string;
	permalink?: string;
	username: string;
	shortcode: string;
	thumbnail_url?: string;
	children?: Reply[];
	has_replies: boolean;
	root_post: { id: string };
	replied_to: { id: string };
	is_reply: boolean;
	hide_status: string;
}

export interface ConversationResponse {
	data: Reply[];
	paging?: {
		cursors: {
			before: string;
			after: string;
		};
	};
}

export interface GetConversationParams {
	reverse?: boolean;
}

export const getConversation = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
	params?: GetConversationParams,
): Promise<ConversationResponse> => {
	const searchParams: Record<string, string | boolean | number> = {
		fields: "id,text,timestamp,media_product_type,media_type,media_url,shortcode,thumbnail_url,children,has_replies,root_post,replied_to,is_reply,hide_status",
		access_token: accessToken.access_token,
		reverse: params?.reverse ?? true,
	};

	return await inst
		.get(`v1.0/${mediaId}/conversation`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
		})
		.then((response) => response.json<ConversationResponse>())
		.catch((error: unknown) => {
			console.error("Error fetching conversation:", error);
			throw error;
		});
};
