export type TimePeriodLabel = "last7days" | "last30days" | "last90days" | `${string} ${number}`;

export interface TimePeriod {
	label: TimePeriodLabel;
	start_date: Date;
	end_date: Date;
}

export interface AccessTokenResponse {
	access_token: string;
	user_id: number;
}

export interface LongTermAccessTokenResponse {
	access_token: string;
	expires_in: number;
}

export type Breakdown = "country" | "city" | "age" | "gender";

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

export interface UserProfileResponse {
	id: string;
	username: string;
	threads_profile_picture_url: string;
	threads_biography: string;
}

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

export interface BreakdownMetricTypeMap {
	country: DemographicMetric;
	city: DemographicMetric;
	age: DemographicMetric;
	gender: DemographicMetric;
}

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
