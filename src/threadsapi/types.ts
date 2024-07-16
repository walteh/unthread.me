export type TimePeriodLabel = "last7days" | "last14days" | "last30days" | "last90days" | `${string} ${number}`;

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
	paging?: {
		previous?: string;
		next?: string;
	};
}

interface MetricListItem {
	label: string;
	value: number;
}

export interface SimplifedMetricTypeMap {
	total_likes: number;
	total_views: number;
	total_replies: number;
	total_followers: number;
	total_quotes: number;
	total_reposts: number;
	views_by_day: MetricListItem[];
}

export interface SimplifiedDemographicMetric {
	demographics_by_age: MetricListItem[];
	demographics_by_country: MetricListItem[];
	demographics_by_city: MetricListItem[];
	demographics_by_gender: MetricListItem[];
}

export interface MetricTypeMap {
	views: TimeSeriesMetric | null;
	likes: TotalValueMetric | null;
	replies: TotalValueMetric | null;
	reposts: TotalValueMetric | null;
	quotes: TotalValueMetric | null;
	followers_count: TotalValueMetric | null;
}

export interface MediaMetricTypeMap {
	views: TimeSeriesMetric | null;
	likes: TimeSeriesMetric | null;
	replies: TimeSeriesMetric | null;
	reposts: TimeSeriesMetric | null;
	quotes: TimeSeriesMetric | null;
}

export interface SimplifedMediaMetricTypeMap {
	total_views: number;
	total_likes: number;
	total_replies: number;
	total_reposts: number;
	total_quotes: number;
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

export interface UserThreadsMap {
	threads: ThreadMedia[];
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
	replied_to: { id: string } | null;
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
