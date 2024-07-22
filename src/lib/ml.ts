import { linearRegression, linearRegressionLine } from "simple-statistics";

import { CachedThreadData } from "@src/client/cache_store";
import { SimplifedMetricTypeMap } from "@src/threadsapi/types";

// export function getDateStringInPacificTime(date: Date) {
// 	const pacificTime = date.toLocaleString("en-US", {
// 		timeZone: "America/Los_Angeles",
// 		month: "2-digit",
// 		day: "2-digit",
// 		year: "numeric",
// 	});

// 	const split = pacificTime.split("/");
// 	const formattedDate = `${split[2]}-${split[0].padStart(2, "0")}-${split[1].padStart(2, "0")}`;

// 	return formattedDate;
// }

export function getDateStringInPacificTime(date: Date) {
	// Pacific Time (PT) is UTC-8 during standard time and UTC-7 during daylight saving time.
	const PST_OFFSET = -8 * 60; // UTC-8 in minutes
	const PDT_OFFSET = -7 * 60; // UTC-7 in minutes

	// Check if daylight saving time is in effect
	const isDST = (d: Date) => {
		const jan = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
		const jul = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();
		return Math.max(jan, jul) !== d.getTimezoneOffset();
	};

	const offset = isDST(date) ? PDT_OFFSET : PST_OFFSET;

	// Convert the date to PT by adjusting the timezone offset
	const pacificDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000 + offset * 60000);

	const year = pacificDate.getFullYear();
	const month = String(pacificDate.getMonth() + 1).padStart(2, "0");
	const day = String(pacificDate.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

export function getTimeInPacificTimeWithVeryPoorPerformance(date: Date) {
	const pacificTime = date.toLocaleString("en-US", {
		timeZone: "America/Los_Angeles",
		hour: "numeric",
		minute: "2-digit",
		timeZoneName: "short",
	});

	return pacificTime;
}

export interface InsightsByDate {
	dateInfo: {
		today: string;
		one_week_ago: string;
		two_weeks_ago: string;
		three_weeks_ago: string;
		four_weeks_ago: string;
		five_weeks_ago: string;
		six_weeks_ago: string;
		this_day_last_month: string;
	};
	totalUserViews: number;

	cumlativePostInsights: {
		total_likes: number;
		total_replies: number;
		total_reposts: number;
		total_quotes: number;
		total_views: number;
		total_posts: number;
	};

	relativeInsights(): RelativeInsightsByDate;
}

export interface RelativeInsightsByDate {
	today: InsightsByDate;
	one_week_ago: InsightsByDate;
	two_weeks_ago: InsightsByDate;
	three_weeks_ago: InsightsByDate;
	four_weeks_ago: InsightsByDate;
	five_weeks_ago: InsightsByDate;
	six_weeks_ago: InsightsByDate;
	this_day_last_month: InsightsByDate;
}

export interface MinimalThreadData {
	total_likes: number;
	total_replies: number;
	total_reposts: number;
	total_quotes: number;
	total_views: number;
	timestamp: string;
	total_posts: number;
}

export const convertToInsightsByDate = (data: CachedThreadData): MinimalThreadData => {
	return {
		total_likes: data.insights?.total_likes ?? 0,
		total_replies: data.insights?.total_replies ?? 0,
		total_reposts: data.insights?.total_reposts ?? 0,
		total_quotes: data.insights?.total_quotes ?? 0,
		total_views: data.insights?.total_views ?? 0,
		timestamp: data.media.timestamp,
		total_posts: 1,
	};
};

export const isdbAll = (userInsights: SimplifedMetricTypeMap | null, userThreads: MinimalThreadData[]): Record<string, InsightsByDate> => {
	const startDate = new Date("2024-04-01");
	const endDate = new Date();

	return isdbRange(startDate, endDate, userInsights, userThreads);
};

export const isdbAllNoRelative = (
	userInsights: SimplifedMetricTypeMap | null,
	userThreads: MinimalThreadData[],
): Record<string, InsightsByDate> => {
	const startDate = new Date("2024-04-01");
	const endDate = new Date();

	return isdbRange(startDate, endDate, userInsights, userThreads, false);
};

export const isdbRange = (
	startDate: Date,
	endDate: Date,
	userInsights: SimplifedMetricTypeMap | null,
	userThreads: MinimalThreadData[],
	includeRelativeInsights = true,
): Record<string, InsightsByDate> => {
	const days: string[] = [];

	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
		days.push(new Date(d).toISOString().slice(0, 10));
	}

	const wrk = days
		.reverse()
		.map((date) => {
			return isbd(date, userInsights, userThreads);
		})
		.reduce<Record<string, InsightsByDate>>((acc, data) => {
			acc[data.dateInfo.today] = data;

			return acc;
		}, {});

	if (!includeRelativeInsights) return wrk;

	Object.keys(wrk).forEach((value) => {
		const today = value;

		wrk[value].relativeInsights = () => ({
			today: wrk[today],
			one_week_ago: wrk[wrk[today].dateInfo.one_week_ago],
			two_weeks_ago: wrk[wrk[today].dateInfo.two_weeks_ago],
			three_weeks_ago: wrk[wrk[today].dateInfo.three_weeks_ago],
			four_weeks_ago: wrk[wrk[today].dateInfo.four_weeks_ago],
			five_weeks_ago: wrk[wrk[today].dateInfo.five_weeks_ago],
			six_weeks_ago: wrk[wrk[today].dateInfo.six_weeks_ago],
			this_day_last_month: wrk[wrk[today].dateInfo.this_day_last_month],
		});
	});

	return wrk;
};

export const isbd = (date: string, userInsights: SimplifedMetricTypeMap | null, userThreads: MinimalThreadData[]): InsightsByDate => {
	const ONE_DAY = 24 * 60 * 60 * 1000;

	const dateInfo = {
		today: date,
		one_week_ago: new Date(new Date(date).getTime() - 7 * ONE_DAY).toISOString().slice(0, 10),
		two_weeks_ago: new Date(new Date(date).getTime() - 14 * ONE_DAY).toISOString().slice(0, 10),
		three_weeks_ago: new Date(new Date(date).getTime() - 21 * ONE_DAY).toISOString().slice(0, 10),
		four_weeks_ago: new Date(new Date(date).getTime() - 28 * ONE_DAY).toISOString().slice(0, 10),
		five_weeks_ago: new Date(new Date(date).getTime() - 35 * ONE_DAY).toISOString().slice(0, 10),
		six_weeks_ago: new Date(new Date(date).getTime() - 42 * ONE_DAY).toISOString().slice(0, 10),
		this_day_last_month: this_day_last_month(date),
	};
	if (!userInsights)
		return {
			dateInfo: dateInfo,
			totalUserViews: 0,
			cumlativePostInsights: {
				total_likes: 0,
				total_replies: 0,
				total_reposts: 0,
				total_quotes: 0,
				total_views: 0,
				total_posts: 0,
			},
			relativeInsights: () => ({}) as RelativeInsightsByDate,
		};

	const totalViews = userInsights.views_by_day.filter((v) => getDateStringInPacificTime(new Date(v.label)) === date)[0]?.value ?? 0;

	const cumlativePostInsights = userThreads
		.filter((thread) => {
			return getDateStringInPacificTime(new Date(thread.timestamp)) === date;
		})
		.reduce(
			(acc, data) => {
				return {
					total_likes: acc.total_likes + data.total_likes,
					total_replies: acc.total_replies + data.total_replies,
					total_reposts: acc.total_reposts + data.total_reposts,
					total_quotes: acc.total_quotes + data.total_quotes,
					total_views: acc.total_views + data.total_views,
					total_posts: acc.total_posts + 1,
				};
			},
			{
				total_likes: 0,
				total_replies: 0,
				total_reposts: 0,
				total_quotes: 0,
				total_views: 0,
				total_posts: 0,
			},
		);

	return {
		relativeInsights: () => ({}) as RelativeInsightsByDate,
		totalUserViews: totalViews,
		cumlativePostInsights,
		dateInfo,
	};
};

const this_day_last_month = (date: string): string => {
	const split = date.split("-");

	const month = parseInt(split[1]);
	const year = parseInt(split[0]);
	const lastMonth = month === 1 ? 12 : month - 1;
	const lastYear = month === 1 ? year - 1 : year;
	const lastMonthDays = new Date(lastYear, lastMonth, 0).getDate();
	const today = parseInt(split[2]);

	// If today is greater than last month's last day, return last month's last day
	if (today > lastMonthDays) return `${lastYear}-${lastMonth.toString().padStart(2, "0")}-${lastMonthDays.toString().padStart(2, "0")}`;

	return `${lastYear}-${lastMonth.toString().padStart(2, "0")}-${today.toString().padStart(2, "0")}`;
};

export interface MLData {
	dates: string[];
	viewsData: number[];
	likesData: number[];
	repliesData: number[];
	repostsData: number[];
	quotesData: number[];
	userViewsData: number[];
}

export const transformDataForML = (relativeInsights: Record<string, InsightsByDate>, date: Date): MLData => {
	const dates: string[] = [];

	const viewsData: number[] = [];
	const likesData: number[] = [];
	const repliesData: number[] = [];
	const repostsData: number[] = [];
	const quotesData: number[] = [];
	const userViewsData: number[] = [];

	const insights = relativeInsights[date.toISOString().slice(0, 10)].relativeInsights();
	Object.keys(insights).forEach((insight) => {
		const key = insight as keyof RelativeInsightsByDate;
		const isi = insights[key] as InsightsByDate | undefined;
		if (isi && (key === "today" || key.includes("week"))) {
			dates.push(isi.dateInfo.today);
			viewsData.push(isi.cumlativePostInsights.total_views);
			likesData.push(isi.cumlativePostInsights.total_likes);
			repliesData.push(isi.cumlativePostInsights.total_replies);
			repostsData.push(isi.cumlativePostInsights.total_reposts);
			quotesData.push(isi.cumlativePostInsights.total_quotes);
			userViewsData.push(isi.totalUserViews);
		}
	});

	return { dates, viewsData, likesData, repliesData, repostsData, quotesData, userViewsData };
};

export const transormFullDataForML = (relativeInsights: Record<string, InsightsByDate>): MLData => {
	const dates: string[] = [];

	const viewsData: number[] = [];
	const likesData: number[] = [];
	const repliesData: number[] = [];
	const repostsData: number[] = [];
	const quotesData: number[] = [];
	const userViewsData: number[] = [];

	const insightsArrayByDateSorted = Object.entries(relativeInsights)
		.sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
		.map(([, value]) => value);

	insightsArrayByDateSorted.forEach((isi) => {
		const { today, total_likes, total_replies, total_reposts, total_quotes, total_views } = {
			today: isi.dateInfo.today,
			...isi.cumlativePostInsights,
		};

		dates.push(today);
		viewsData.push(total_views);
		likesData.push(total_likes);
		repliesData.push(total_replies);
		repostsData.push(total_reposts);
		quotesData.push(total_quotes);
		userViewsData.push(isi.totalUserViews);
	});

	// r

	return { dates, viewsData, likesData, repliesData, repostsData, quotesData, userViewsData };
};

export const movingAverage = (data: number[], windowSize: number): number[] => {
	const result = [];
	for (let i = 0; i <= data.length - windowSize; i++) {
		const window = data.slice(i, i + windowSize);
		const average = window.reduce((sum, value) => sum + value, 0) / windowSize;
		result.push(average);
	}
	return result;
};

export const formatNumber = (number: number) => {
	const num = Math.round(number);
	if (number < 1000) num.toString();
	const formatter = Intl.NumberFormat("en", { notation: "compact", minimumFractionDigits: 0 });
	return formatter.format(num);
};

export const analyzeTrendWithLinearRegression = (data: number[]) => {
	if (data.length === 0) return { trend: [] as number[], nextValue: NaN, slope: NaN, intercept: NaN };

	const points = data.map((value, index) => [index, value]);
	const regression = linearRegression(points);
	const predict = linearRegressionLine(regression);

	const trend = data.map((_, index) => predict(index));
	const nextValue = predict(data.length);

	const slope = regression.m;
	const intercept = regression.b;

	// console.log("Trend:", trend);
	// console.log("Next Value:", nextValue);
	// console.log("Equation:", equation);

	return { trend, nextValue: parseFloat(nextValue.toFixed(2)), slope, intercept };
};
