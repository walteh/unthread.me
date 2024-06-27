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

type Breakdown = "country" | "city" | "age" | "gender";

export interface GetUserInsightsParams {
	since?: number;
	until?: number;
	breakdown?: Breakdown;
	all_time?: boolean;
}

export interface GetMediaInsightsParams {
	since?: number;
	until?: number;
}

export interface TimeSeriesMetric {
	name: string;
	period: string;
	values: { value: number; end_time: string }[];
	title: string;
	description: string;
	id: string;
}

export interface BreakdownMetric {
	dimension_keys: string[];
	results: { dimension_values: string[]; value: number }[];
}

export interface DemographicMetricPayload {
	name: string;
	period: string;
	total_value: { breakdowns: BreakdownMetric[] };
	title: string;
	description: string;
	id: string;
}

export interface DemographicMetric extends DemographicMetricPayload {
	simplified_values: { value: number; label: string }[];
}

export interface TotalValueMetric {
	name: string;
	period: string;
	total_value: { value: number };
	title: string;
	description: string;
	id: string;
}

export type InsightMetric = TotalValueMetric | TimeSeriesMetric;

export interface InsightsResponse<T> {
	data: T[];
}

export interface MetricTypeMap {
	views: TimeSeriesMetric | null;
	likes: TotalValueMetric | null;
	replies: TotalValueMetric | null;
	reposts: TotalValueMetric | null;
	quotes: TotalValueMetric | null;
	followers_count: TotalValueMetric | null;
	follower_demographics: TotalValueMetric | null;
}

export interface MediaMetricTypeMap {
	views: TimeSeriesMetric | null;
	likes: TimeSeriesMetric | null;
	replies: TotalValueMetric | null;
	reposts: TotalValueMetric | null;
	quotes: TotalValueMetric | null;
}

export type Metric = keyof MetricTypeMap;
export type MediaMetric = keyof MediaMetricTypeMap;

export const getAllUserInsightsWithDefaultParams = async (inst: KyInstance, accessToken: AccessTokenResponse): Promise<MetricTypeMap> => {
	return await getAllUserInsights(inst, accessToken, { all_time: true });
};

// Media Insights

// User Insights
const allUserMetrics: Metric[] = ["views", "likes", "replies", "reposts", "quotes", "followers_count"];

export const getAllUserInsights = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	params: GetUserInsightsParams = {},
): Promise<MetricTypeMap> => {
	const searchParams: Record<string, string | number> = {
		metric: allUserMetrics.join(","),
		access_token: accessToken.access_token,
	};

	if (params.all_time) {
		searchParams.since = 1712991600; // from the docs
		searchParams.until = Math.floor(Date.now() / 1000);
	} else {
		if (params.since) searchParams.since = params.since;
		if (params.until) searchParams.until = params.until;
	}

	return await inst
		.get(`v1.0/${accessToken.user_id}/threads_insights`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
		})
		.then((response) => response.json<InsightsResponse<MetricTypeMap[Metric]>>())
		.then((data) => {
			const mapper: MetricTypeMap = {} as MetricTypeMap;
			for (const metric of data.data) {
				switch (metric?.name) {
					case "views":
						mapper.views = metric as TimeSeriesMetric;
						break;
					case "likes":
						mapper.likes = metric as TotalValueMetric;
						break;
					case "replies":
						mapper.replies = metric as TotalValueMetric;
						break;
					case "reposts":
						mapper.reposts = metric as TotalValueMetric;
						break;
					case "quotes":
						mapper.quotes = metric as TotalValueMetric;
						break;
					case "followers_count":
						mapper.followers_count = metric as TotalValueMetric;
						break;
				}
			}
			return mapper;
		})
		.catch((error: unknown) => {
			console.error("Error fetching user insights:", error);
			throw error;
		});
};

const breakdownTypes: Breakdown[] = ["country", "city", "age", "gender"];

export interface BreakdownMetricTypeMap {
	country: DemographicMetric;
	city: DemographicMetric;
	age: DemographicMetric;
	gender: DemographicMetric;
}

export const getFollowerDemographicsInsights = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
): Promise<BreakdownMetricTypeMap> => {
	const fetchDemographic = async (breakdown: Breakdown) => {
		const searchParams: Record<string, string> = {
			metric: "follower_demographics",
			access_token: accessToken.access_token,
			breakdown: breakdown,
		};

		return await inst
			.get(`v1.0/${accessToken.user_id}/threads_insights`, {
				searchParams,
				headers: {
					"Content-Type": "application/json",
				},
				timeout: 10000,
			})
			.then((response) => response.json<InsightsResponse<DemographicMetricPayload>>())
			.then((data) => {
				// cionvert the payload to the correct type
				const breakdown = data.data[0].total_value.breakdowns[0];

				const items: { label: string; value: number }[] = [];

				for (const item of breakdown.results) {
					console.log(item);
					items.push({
						label: item.dimension_values.join(", "),
						value: item.value,
					});
				}

				const demographic: DemographicMetric = {
					...data.data[0],
					simplified_values: items,
				};

				return demographic;
			})
			.catch((error: unknown) => {
				console.error("Error fetching follower demographics insights:", error);
				throw error;
			});
	};

	const results = await Promise.all(breakdownTypes.map(fetchDemographic));

	const demographics: BreakdownMetricTypeMap = {
		country: results[0],
		city: results[1],
		age: results[2],
		gender: results[3],
	};

	return demographics;
};

// Media Insights

const allMediaMetrics: MediaMetric[] = ["views", "likes", "replies", "reposts", "quotes"];

export const getAllMediaInsights = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
	params: GetMediaInsightsParams = {},
): Promise<MediaMetricTypeMap> => {
	const searchParams: Record<string, string | number> = {
		metric: allMediaMetrics.join(","),
		access_token: accessToken.access_token,
	};

	if (params.since) searchParams.since = params.since;
	if (params.until) searchParams.until = params.until;

	return await inst
		.get(`v1.0/${mediaId}/insights`, {
			searchParams,
			headers: {
				"Content-Type": "application/json",
			},
			timeout: 10000,
		})
		.then((response) => response.json<InsightsResponse<MediaMetricTypeMap[MediaMetric]>>())
		.then((data) => {
			const mapper: MediaMetricTypeMap = {} as MediaMetricTypeMap;
			for (const metric of data.data) {
				switch (metric?.name) {
					case "views":
						mapper.views = metric as TimeSeriesMetric;
						break;
					case "likes":
						mapper.likes = metric as TimeSeriesMetric;
						break;
					case "replies":
						mapper.replies = metric as TotalValueMetric;
						break;
					case "reposts":
						mapper.reposts = metric as TotalValueMetric;
						break;
					case "quotes":
						mapper.quotes = metric as TotalValueMetric;
						break;
				}
			}
			return mapper;
		})
		.catch((error: unknown) => {
			console.error("Error fetching media insights:", error);
			throw error;
		});
};

export const getMediaInsightsWithDefaultParams = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
): Promise<MediaMetricTypeMap> => {
	return await getAllMediaInsights(inst, accessToken, mediaId, {});
};

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
		.get(`v1.0/me/threads`, {
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
		fields: "id,text,timestamp,media_product_type,media_type,media_url,shortcode,thumbnail_url,children,has_replies,root_post,replied_to,is_reply,hide_status,username",
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

export const getDefaultConversation = async (
	inst: KyInstance,
	accessToken: AccessTokenResponse,
	mediaId: string,
): Promise<ConversationResponse> => {
	return await getConversation(inst, accessToken, mediaId, {});
};
