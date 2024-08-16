import { linearRegression, linearRegressionLine } from "simple-statistics";

import {
	calculateMultiCombinedEngagementRate,
	calculateMultiReplyEngagementRate,
	calculateMultiThreadEngagementRate,
} from "@src/client/hooks/useEngagementRate";
import { CachedReplyData } from "@src/client/reply_store";
import { CachedThreadData } from "@src/client/thread_store";
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

export const getDayOfWeek = (date: string) => {
	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const day = new Date(date + "T00:00:00").getDay();

	if (isNaN(day)) return "Invalid Date";
	return days[day].toUpperCase();
};

export const getWeekOfYear = (date: string) => {
	const dateObject = new Date(date + "T00:00:00");
	const startOfYear = new Date(dateObject.getFullYear(), 0, 0);
	const diff = dateObject.getTime() - startOfYear.getTime();
	const oneDay = 1000 * 60 * 60 * 24;
	const day = Math.floor(diff / oneDay);
	const week = Math.floor(day / 7);
	return `${dateObject.getFullYear()}-W${String(week).padStart(2, "0")}`;
};

export function getTimeInPacificTimeWithVeryPoorPerformance(date: Date) {
	const pacificTime = date.toLocaleString("en-US", {
		timeZone: "America/Los_Angeles",
		hour: "numeric",
		minute: "2-digit",
		timeZoneName: "short",
	});

	return pacificTime;
}

export interface AggregatedInsights {
	engegementRate: number;
	activityRate: number;
	reachRate: number;
	total_likes: number;
	total_replies: number;
	total_reposts: number;
	total_quotes: number;
	total_views: number;
	total_posts: number;
}
export interface InsightsByDate {
	// dateInfo: {
	// 	today: string;
	// 	one_week_ago: string;
	// 	two_weeks_ago: string;
	// 	three_weeks_ago: string;
	// 	four_weeks_ago: string;
	// 	five_weeks_ago: string;
	// 	six_weeks_ago: string;
	// 	this_day_last_month: string;
	// };

	label: string;

	totalUserViews: number;

	cumlativePostInsights: AggregatedInsights;

	cumlativeReplyInsights: AggregatedInsights;

	combinedInsights: AggregatedInsights;

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

export const convertToInsightsByDateReply = (data: CachedReplyData): MinimalThreadData => {
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

export const isdbAll = (
	userInsights: SimplifedMetricTypeMap | null,
	userThreads: CachedThreadData[],
	userReplies: CachedReplyData[],
): Record<string, InsightsByDate> => {
	const startDate = new Date("2024-04-01");
	const endDate = new Date();

	return isdbRange(startDate, endDate, userInsights, userThreads, userReplies);
};

export const isdbAllNoRelative = (
	userInsights: SimplifedMetricTypeMap | null,
	userThreads: CachedThreadData[],
	userReplies: CachedReplyData[],
): Record<string, InsightsByDate> => {
	const startDate = new Date("2024-04-01");
	const endDate = new Date();

	return isdbRange(startDate, endDate, userInsights, userThreads, userReplies, false);
};

export const isdbAllNoRelativeWeekly = (
	userInsights: SimplifedMetricTypeMap | null,
	userThreads: CachedThreadData[],
	userReplies: CachedReplyData[],
): Record<string, InsightsByDate> => {
	const startDate = new Date("2024-04-01");
	const endDate = new Date();

	return isdbRangeWeekly(startDate, endDate, userInsights, userThreads, userReplies);
};

export const isdbAllNoRelativeMonthly = (
	userInsights: SimplifedMetricTypeMap | null,
	userThreads: CachedThreadData[],
	userReplies: CachedReplyData[],
): Record<string, InsightsByDate> => {
	const startDate = new Date("2024-04-01");
	const endDate = new Date();

	return isdbRangeMonthly(startDate, endDate, userInsights, userThreads, userReplies);
};

export const isdbRange = (
	startDate: Date,
	endDate: Date,
	userInsights: SimplifedMetricTypeMap | null,
	userThreads: CachedThreadData[],
	userReplies: CachedReplyData[],
	includeRelativeInsights = true,
): Record<string, InsightsByDate> => {
	const days: string[] = [];

	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
		days.push(new Date(d).toISOString().slice(0, 10));
	}

	const wrk = days
		.reverse()
		.map((date) => {
			return {
				date: date,
				isdb: isbd(date, userInsights, userThreads, userReplies, (d) => calculateDayInPacificTime(d) === date),
			};
		})
		.reduce<Record<string, InsightsByDate>>((acc, data) => {
			acc[data.date] = data.isdb;

			return acc;
		}, {});

	if (!includeRelativeInsights) return wrk;

	// Object.keys(wrk).forEach((value) => {
	// 	const today = value;

	// 	wrk[value].relativeInsights = () => ({
	// 		today: wrk[today],
	// 		one_week_ago: wrk[wrk[today].dateInfo.one_week_ago],
	// 		two_weeks_ago: wrk[wrk[today].dateInfo.two_weeks_ago],
	// 		three_weeks_ago: wrk[wrk[today].dateInfo.three_weeks_ago],
	// 		four_weeks_ago: wrk[wrk[today].dateInfo.four_weeks_ago],
	// 		five_weeks_ago: wrk[wrk[today].dateInfo.five_weeks_ago],
	// 		six_weeks_ago: wrk[wrk[today].dateInfo.six_weeks_ago],
	// 		this_day_last_month: wrk[wrk[today].dateInfo.this_day_last_month],
	// 	});
	// });

	return wrk;
};

export const calculateWeekInPacificTime = (date: string) => {
	return getWeekOfYear(getDateStringInPacificTime(new Date(date)));
};

export const calculateMonthInPacificTime = (date: string) => {
	return getDateStringInPacificTime(new Date(date)).slice(0, 7);
};

export const calculateDayInPacificTime = (date: string) => {
	return getDateStringInPacificTime(new Date(date));
};

export const isdbRangeWeekly = (
	startDate: Date,
	endDate: Date,
	userInsights: SimplifedMetricTypeMap | null,
	userThreads: CachedThreadData[],
	userReplies: CachedReplyData[],
): Record<string, InsightsByDate> => {
	const weeks: string[] = [];

	for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
		weeks.push(getWeekOfYear(new Date(d).toISOString().slice(0, 10)));
	}

	const wrk = weeks
		.reverse()
		.map((weekOfYear) => {
			return {
				date: weekOfYear,
				isdb: isbd(weekOfYear, userInsights, userThreads, userReplies, (d) => calculateWeekInPacificTime(d) === weekOfYear),
			};
		})
		.reduce<Record<string, InsightsByDate>>((acc, data) => {
			acc[data.date] = data.isdb;

			return acc;
		}, {});

	return wrk;
};

export const isdbRangeMonthly = (
	startDate: Date,
	endDate: Date,
	userInsights: SimplifedMetricTypeMap | null,
	userThreads: CachedThreadData[],
	userReplies: CachedReplyData[],
): Record<string, InsightsByDate> => {
	const months: string[] = [];

	for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
		months.push(new Date(d).toISOString().slice(0, 7));
	}

	const wrk = months
		.reverse()
		.map((month) => {
			return {
				date: month,
				isdb: isbd(month, userInsights, userThreads, userReplies, (d) => calculateMonthInPacificTime(d) === month),
			};
		})
		.reduce<Record<string, InsightsByDate>>((acc, data) => {
			acc[data.date] = data.isdb;

			return acc;
		}, {});

	return wrk;
};

export const isbd = (
	label: string,
	userInsights: SimplifedMetricTypeMap | null,
	userThreads: CachedThreadData[],
	userReplies: CachedReplyData[],
	dateFunc: (date: string) => boolean,
): InsightsByDate => {
	// const ONE_DAY = 24 * 60 * 60 * 1000;

	// const dateInfo = {
	// 	today: startDate,
	// 	one_week_ago: new Date(new Date(startDate).getTime() - 7 * ONE_DAY).toISOString().slice(0, 10),
	// 	two_weeks_ago: new Date(new Date(startDate).getTime() - 14 * ONE_DAY).toISOString().slice(0, 10),
	// 	three_weeks_ago: new Date(new Date(startDate).getTime() - 21 * ONE_DAY).toISOString().slice(0, 10),
	// 	four_weeks_ago: new Date(new Date(startDate).getTime() - 28 * ONE_DAY).toISOString().slice(0, 10),
	// 	five_weeks_ago: new Date(new Date(startDate).getTime() - 35 * ONE_DAY).toISOString().slice(0, 10),
	// 	six_weeks_ago: new Date(new Date(startDate).getTime() - 42 * ONE_DAY).toISOString().slice(0, 10),
	// 	this_day_last_month: this_day_last_month(startDate),
	// };
	if (!userInsights)
		return {
			label: label,
			// dateInfo: dateInfo,
			totalUserViews: 0,
			cumlativePostInsights: {
				engegementRate: 0,
				activityRate: 0,
				reachRate: 0,
				total_likes: 0,
				total_replies: 0,
				total_reposts: 0,
				total_quotes: 0,
				total_views: 0,
				total_posts: 0,
			},
			cumlativeReplyInsights: {
				engegementRate: 0,
				activityRate: 0,
				reachRate: 0,
				total_likes: 0,
				total_replies: 0,
				total_reposts: 0,
				total_quotes: 0,
				total_views: 0,
				total_posts: 0,
			},
			combinedInsights: {
				engegementRate: 0,
				activityRate: 0,
				reachRate: 0,
				total_likes: 0,
				total_replies: 0,
				total_reposts: 0,
				total_quotes: 0,
				total_views: 0,
				total_posts: 0,
			},
			relativeInsights: () => ({}) as RelativeInsightsByDate,
		};

	const totalViews = userInsights.views_by_day.filter((v) => dateFunc(v.label)).reduce((acc, data) => acc + data.value, 0);

	const cumlativePostInsights = userThreads
		.map((thread) => convertToInsightsByDate(thread))
		.filter((thread) => {
			return dateFunc(thread.timestamp);
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

	const cumlativeReplyInsights = userReplies
		.filter((reply) => {
			return dateFunc(reply.media.timestamp);
		})
		.map((thread) => convertToInsightsByDateReply(thread))

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

	const combinedInsights = {
		total_likes: cumlativePostInsights.total_likes + cumlativeReplyInsights.total_likes,
		total_replies: cumlativePostInsights.total_replies + cumlativeReplyInsights.total_replies,
		total_reposts: cumlativePostInsights.total_reposts + cumlativeReplyInsights.total_reposts,
		total_quotes: cumlativePostInsights.total_quotes + cumlativeReplyInsights.total_quotes,
		total_views: cumlativePostInsights.total_views + cumlativeReplyInsights.total_views,
		total_posts: cumlativePostInsights.total_posts + cumlativeReplyInsights.total_posts,
	};

	const threadsFiltered = userThreads.filter((thread) => {
		return dateFunc(thread.media.timestamp);
	});

	const repliesFiltered = userReplies.filter((reply) => {
		return dateFunc(reply.media.timestamp);
	});

	const [engagement, reach, activity] = calculateMultiThreadEngagementRate(threadsFiltered, userInsights);

	const [engagementReply, reachReply, activityReply] = calculateMultiReplyEngagementRate(repliesFiltered, userInsights);

	const [engagementCombined, reachCombined, activityCombined] = calculateMultiCombinedEngagementRate(
		threadsFiltered,
		repliesFiltered,
		userInsights,
	);

	return {
		label: label,
		relativeInsights: () => ({}) as RelativeInsightsByDate,
		totalUserViews: totalViews,
		cumlativePostInsights: {
			engegementRate: engagement,
			activityRate: activity,
			reachRate: reach,
			...cumlativePostInsights,
		},
		cumlativeReplyInsights: {
			engegementRate: engagementReply,
			activityRate: activityReply,
			reachRate: reachReply,
			...cumlativeReplyInsights,
		},
		combinedInsights: {
			engegementRate: engagementCombined,
			activityRate: activityCombined,
			reachRate: reachCombined,
			...combinedInsights,
		},
		// dateInfo,
	};
};

export const this_day_last_month = (date: string): string => {
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
	userViews: number[];
	posts: MLDatas;
	replies: MLDatas;
	combined: MLDatas;
}

export interface MLDatas {
	views: number[];
	likes: number[];
	replies: number[];
	reposts: number[];
	quotes: number[];
	engagementRate: number[];
	reachRate: number[];
	activityRate: number[];
}

// export const transformPostDataForML = (relativeInsights: Record<string, InsightsByDate>, date: Date): MLData => {
// 	const dates: string[] = [];

// 	const viewsData: number[] = [];
// 	const likesData: number[] = [];
// 	const repliesData: number[] = [];
// 	const repostsData: number[] = [];
// 	const quotesData: number[] = [];
// 	const userViewsData: number[] = [];
// 	const engagementRateData: number[] = [];
// 	const reachRateData: number[] = [];
// 	const activityRateData: number[] = [];

// 	const replyViewsData: number[] = [];
// 	const replyLikesData: number[] = [];
// 	const replyRepliesData: number[] = [];
// 	const replyRepostsData: number[] = [];
// 	const replyQuotesData: number[] = [];
// 	const replyEngagementRateData: number[] = [];
// 	const replyReachRateData: number[] = [];
// 	const replyActivityRateData: number[] = [];

// 	const insights = relativeInsights[date.toISOString().slice(0, 10)].relativeInsights();
// 	Object.keys(insights).forEach((insight) => {
// 		const key = insight as keyof RelativeInsightsByDate;
// 		const isi = insights[key] as InsightsByDate | undefined;
// 		if (isi && (key === "today" || key.includes("week"))) {
// 			dates.push(isi.label);
// 			viewsData.push(isi.cumlativePostInsights.total_views);
// 			likesData.push(isi.cumlativePostInsights.total_likes);
// 			repliesData.push(isi.cumlativePostInsights.total_replies);
// 			repostsData.push(isi.cumlativePostInsights.total_reposts);
// 			quotesData.push(isi.cumlativePostInsights.total_quotes);
// 			userViewsData.push(isi.totalUserViews);
// 			engagementRateData.push(isi.cumlativePostInsights.engegementRate);
// 			reachRateData.push(isi.cumlativePostInsights.reachRate);
// 			activityRateData.push(isi.cumlativePostInsights.activityRate);
// 			replyViewsData.push(isi.cumlativeReplyInsights.total_views);
// 			replyLikesData.push(isi.cumlativeReplyInsights.total_likes);
// 			replyRepliesData.push(isi.cumlativeReplyInsights.total_replies);
// 			replyRepostsData.push(isi.cumlativeReplyInsights.total_reposts);
// 			replyQuotesData.push(isi.cumlativeReplyInsights.total_quotes);
// 			replyEngagementRateData.push(isi.cumlativeReplyInsights.engegementRate);
// 			replyReachRateData.push(isi.cumlativeReplyInsights.reachRate);
// 			replyActivityRateData.push(isi.cumlativeReplyInsights.activityRate);
// 		}
// 	});

// 	return {
// 		dates,
// 		userViews: userViewsData,
// 		posts: {
// 			views: viewsData,
// 			likes: likesData,
// 			replies: repliesData,
// 			reposts: repostsData,
// 			quotes: quotesData,
// 			engagementRate: engagementRateData,
// 			reachRate: reachRateData,
// 			activityRate: activityRateData,
// 		},
// 		replies: {
// 			views: replyViewsData,
// 			likes: replyLikesData,
// 			replies: replyRepliesData,
// 			reposts: replyRepostsData,
// 			quotes: replyQuotesData,
// 			engagementRate: replyEngagementRateData,
// 			reachRate: replyReachRateData,
// 			activityRate: replyActivityRateData,
// 		},
// 	};
// };

export const transormFullPostDataForML = (relativeInsights: InsightsByDate[]): MLData => {
	const dates: string[] = [];

	const viewsData: number[] = [];
	const likesData: number[] = [];
	const repliesData: number[] = [];
	const repostsData: number[] = [];
	const quotesData: number[] = [];
	const userViewsData: number[] = [];
	const engagementRateData: number[] = [];
	const reachRateData: number[] = [];
	const activityRateData: number[] = [];

	const replyViewsData: number[] = [];
	const replyLikesData: number[] = [];
	const replyRepliesData: number[] = [];
	const replyRepostsData: number[] = [];
	const replyQuotesData: number[] = [];
	const replyEngagementRateData: number[] = [];
	const replyReachRateData: number[] = [];
	const replyActivityRateData: number[] = [];

	relativeInsights.forEach((isi) => {
		const { total_likes, total_replies, total_reposts, total_quotes, total_views } = {
			...isi.cumlativePostInsights,
		};

		viewsData.push(total_views);
		likesData.push(total_likes);
		repliesData.push(total_replies);
		repostsData.push(total_reposts);
		quotesData.push(total_quotes);
		userViewsData.push(isi.totalUserViews);
		engagementRateData.push(isi.cumlativePostInsights.engegementRate);
		reachRateData.push(isi.cumlativePostInsights.reachRate);
		activityRateData.push(isi.cumlativePostInsights.activityRate);
		replyViewsData.push(isi.cumlativeReplyInsights.total_views);
		replyLikesData.push(isi.cumlativeReplyInsights.total_likes);
		replyRepliesData.push(isi.cumlativeReplyInsights.total_replies);
		replyRepostsData.push(isi.cumlativeReplyInsights.total_reposts);
		replyQuotesData.push(isi.cumlativeReplyInsights.total_quotes);
		replyEngagementRateData.push(isi.cumlativeReplyInsights.engegementRate);
		replyReachRateData.push(isi.cumlativeReplyInsights.reachRate);
		replyActivityRateData.push(isi.cumlativeReplyInsights.activityRate);
	});

	// r

	return {
		dates,
		userViews: userViewsData,
		posts: {
			views: viewsData,
			likes: likesData,
			replies: repliesData,
			reposts: repostsData,
			quotes: quotesData,
			engagementRate: engagementRateData,
			reachRate: reachRateData,
			activityRate: activityRateData,
		},
		replies: {
			views: replyViewsData,
			likes: replyLikesData,
			replies: replyRepliesData,
			reposts: replyRepostsData,
			quotes: replyQuotesData,
			engagementRate: replyEngagementRateData,
			reachRate: replyReachRateData,
			activityRate: replyActivityRateData,
		},
		combined: {
			views: viewsData.map((value, index) => value + replyViewsData[index]),
			likes: likesData.map((value, index) => value + replyLikesData[index]),
			replies: repliesData.map((value, index) => value + replyRepliesData[index]),
			reposts: repostsData.map((value, index) => value + replyRepostsData[index]),
			quotes: quotesData.map((value, index) => value + replyQuotesData[index]),
			engagementRate: engagementRateData.map((value, index) => value + replyEngagementRateData[index]),
			reachRate: reachRateData.map((value, index) => value + replyReachRateData[index]),
			activityRate: activityRateData.map((value, index) => value + replyActivityRateData[index]),
		},
	};
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
	if (!Number.isFinite(number)) {
		return "0.0";
	}
	if (Number.isNaN(number)) {
		return "0.0";
	}
	if (number < 1) return number.toPrecision(2);
	const num = Math.round(number);
	if (number < 1000) num.toString();
	const formatter = Intl.NumberFormat("en", { notation: "compact", minimumFractionDigits: 0, maximumFractionDigits: 2 });
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
