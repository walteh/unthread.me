import { linearRegression, linearRegressionLine } from "simple-statistics";

import { CachedThreadData } from "@src/client/cache_store";
import { SimplifedMetricTypeMap } from "@src/threadsapi/types";

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

export const isdbAll = (userInsights: SimplifedMetricTypeMap | null, userThreads: CachedThreadData[]): Record<string, InsightsByDate> => {
	const startDate = new Date("2024-04-01");
	const endDate = new Date();

	return isdbRange(startDate, endDate, userInsights, userThreads);
};

export const isdbRange = (
	startDate: Date,
	endDate: Date,
	userInsights: SimplifedMetricTypeMap | null,
	userThreads: CachedThreadData[],
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

export const isbd = (date: string, userInsights: SimplifedMetricTypeMap | null, userThreads: CachedThreadData[]): InsightsByDate => {
	if (!userInsights) return {} as InsightsByDate;

	const totalViews = userInsights.views_by_day.filter((v) => new Date(v.label).toISOString().slice(0, 10) === date)[0]?.value ?? 0;

	const cumlativePostInsights = userThreads.reduce(
		(acc, data) => {
			if (!data.insights) return acc;
			return {
				total_likes: acc.total_likes + data.insights.total_likes,
				total_replies: acc.total_replies + data.insights.total_replies,
				total_reposts: acc.total_reposts + data.insights.total_reposts,
				total_quotes: acc.total_quotes + data.insights.total_quotes,
				total_views: acc.total_views + data.insights.total_views,
			};
		},
		{
			total_likes: 0,
			total_replies: 0,
			total_reposts: 0,
			total_quotes: 0,
			total_views: 0,
		},
	);

	const okay = this_day_last_month(date);
	const ONE_DAY = 24 * 60 * 60 * 1000;

	return {
		relativeInsights: () => ({}) as RelativeInsightsByDate,
		totalUserViews: totalViews,
		cumlativePostInsights,
		dateInfo: {
			today: date,
			one_week_ago: new Date(new Date(date).getTime() - 7 * ONE_DAY).toISOString().slice(0, 10),
			two_weeks_ago: new Date(new Date(date).getTime() - 14 * ONE_DAY).toISOString().slice(0, 10),
			three_weeks_ago: new Date(new Date(date).getTime() - 21 * ONE_DAY).toISOString().slice(0, 10),
			four_weeks_ago: new Date(new Date(date).getTime() - 28 * ONE_DAY).toISOString().slice(0, 10),
			five_weeks_ago: new Date(new Date(date).getTime() - 35 * ONE_DAY).toISOString().slice(0, 10),
			six_weeks_ago: new Date(new Date(date).getTime() - 42 * ONE_DAY).toISOString().slice(0, 10),
			this_day_last_month: okay,
		},
	};
};

const this_day_last_month = (date: string): string => {
	const month = new Date(date).getMonth() + 1;
	const year = new Date(date).getFullYear();
	const lastMonth = month === 1 ? 12 : month - 1;
	const lastYear = month === 1 ? year - 1 : year;
	const lastMonthDays = new Date(lastYear, lastMonth, 0).getUTCDate();
	const today = new Date(date).getDate();

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
}

export const transformDataForML = (relativeInsights: Record<string, InsightsByDate>, date: Date): MLData => {
	const dates: string[] = [];

	const viewsData: number[] = [];
	const likesData: number[] = [];
	const repliesData: number[] = [];
	const repostsData: number[] = [];
	const quotesData: number[] = [];

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
		}
	});

	return { dates, viewsData, likesData, repliesData, repostsData, quotesData };
};

export const transormFullDataForML = (relativeInsights: Record<string, InsightsByDate>): MLData => {
	const dates: string[] = [];

	const viewsData: number[] = [];
	const likesData: number[] = [];
	const repliesData: number[] = [];
	const repostsData: number[] = [];
	const quotesData: number[] = [];

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
	});

	// r

	return { dates, viewsData, likesData, repliesData, repostsData, quotesData };
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
	const formatter = Intl.NumberFormat("en", { notation: "compact", minimumFractionDigits: 0 });
	return formatter.format(number);
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
