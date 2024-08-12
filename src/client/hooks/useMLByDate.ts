import { useMemo, useState } from "react";

import { analyzeTrendWithLinearRegression, InsightsByDate, MLData, transormFullPostDataForML } from "@src/lib/ml";
import { TimePeriod } from "@src/threadsapi/types";

import { useInsightsByDateRange } from "./useInsightsByDate";

export const chartTypes = {
	"user views": {
		name: "user views",
		color: "#1C64F2",
		mldata: (data: MLData) => data.userViews,
		isbd: (data: InsightsByDate) => data.totalUserViews,
		multiplyBy100: false,
	},
	"post views": {
		name: "post likes",
		color: "#EF4444",
		mldata: (data: MLData) => data.posts.views,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_views,
		multiplyBy100: false,
	},
	"post likes": {
		name: "post likes",
		color: "#EF4444",
		mldata: (data: MLData) => data.posts.likes,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_likes,
		multiplyBy100: false,
	},
	"post replies": {
		name: "post replies",
		color: "#10B981",
		mldata: (data: MLData) => data.posts.replies,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_replies,
		multiplyBy100: false,
	},
	"post reposts": {
		name: "post reposts",
		color: "#F59E0B",
		mldata: (data: MLData) => data.posts.reposts,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_reposts,
		multiplyBy100: false,
	},

	"post quotes": {
		name: "post quotes",
		color: "#3B82F6",
		mldata: (data: MLData) => data.posts.quotes,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_quotes,
		multiplyBy100: false,
	},
	"post engagement": {
		name: "post engagement",
		color: "#10B981",
		mldata: (data: MLData) => data.posts.engagementRate.map((d) => d * 100),
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.engegementRate * 100,
		multiplyBy100: true,
	},
	"post reach": {
		name: "post reach",
		color: "#F59E0B",
		mldata: (data: MLData) => data.posts.reachRate.map((d) => d * 100),
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.reachRate * 100,
		multiplyBy100: true,
	},
	"post activity": {
		name: "post activity",
		color: "#3B82F6",
		mldata: (data: MLData) => data.posts.activityRate.map((d) => d * 100),
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.activityRate * 100,
		multiplyBy100: true,
	},
	"reply views": {
		name: "reply likes",
		color: "#EF4444",
		mldata: (data: MLData) => data.replies.views,
		isbd: (data: InsightsByDate) => data.cumlativeReplyInsights.total_views,
		multiplyBy100: false,
	},
	"reply likes": {
		name: "reply likes",
		color: "#EF4444",
		mldata: (data: MLData) => data.replies.likes,
		isbd: (data: InsightsByDate) => data.cumlativeReplyInsights.total_likes,
		multiplyBy100: false,
	},
	"reply replies": {
		name: "reply replies",
		color: "#10B981",
		mldata: (data: MLData) => data.replies.replies,
		isbd: (data: InsightsByDate) => data.cumlativeReplyInsights.total_replies,
		multiplyBy100: false,
	},
	"reply reposts": {
		name: "reply reposts",
		color: "#F59E0B",
		mldata: (data: MLData) => data.replies.reposts,
		isbd: (data: InsightsByDate) => data.cumlativeReplyInsights.total_reposts,
		multiplyBy100: false,
	},

	"reply quotes": {
		name: "reply quotes",
		color: "#3B82F6",
		mldata: (data: MLData) => data.posts.quotes,
		isbd: (data: InsightsByDate) => data.cumlativeReplyInsights.total_quotes,
		multiplyBy100: false,
	},
	"reply engagement": {
		name: "reply engagement",
		color: "#10B981",
		mldata: (data: MLData) => data.replies.engagementRate.map((d) => d * 100),
		isbd: (data: InsightsByDate) => data.cumlativeReplyInsights.engegementRate * 100,
		multiplyBy100: true,
	},
	"reply reach": {
		name: "reply reach",
		color: "#F59E0B",
		mldata: (data: MLData) => data.replies.reachRate.map((d) => d * 100),
		isbd: (data: InsightsByDate) => data.cumlativeReplyInsights.reachRate * 100,
		multiplyBy100: true,
	},
	"reply activity": {
		name: "reply activity",
		color: "#3B82F6",
		mldata: (data: MLData) => data.replies.activityRate.map((d) => d * 100),
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.activityRate * 100,
		multiplyBy100: true,
	},
} as const;

export const useAllMlData = (timePeriod: TimePeriod): Record<keyof typeof chartTypes, ReturnType<typeof useMLByDate>> => {
	return {
		"user views": useMLByDate("user views", timePeriod),
		"post views": useMLByDate("post views", timePeriod),
		"post likes": useMLByDate("post likes", timePeriod),
		"post replies": useMLByDate("post replies", timePeriod),
		"post reposts": useMLByDate("post reposts", timePeriod),
		"post quotes": useMLByDate("post quotes", timePeriod),
		"post engagement": useMLByDate("post engagement", timePeriod),
		"post reach": useMLByDate("post reach", timePeriod),
		"post activity": useMLByDate("post activity", timePeriod),
		"reply views": useMLByDate("reply views", timePeriod),
		"reply likes": useMLByDate("reply likes", timePeriod),
		"reply replies": useMLByDate("reply replies", timePeriod),
		"reply reposts": useMLByDate("reply reposts", timePeriod),
		"reply quotes": useMLByDate("reply quotes", timePeriod),
		"reply engagement": useMLByDate("reply engagement", timePeriod),
		"reply reach": useMLByDate("reply reach", timePeriod),
		"reply activity": useMLByDate("reply activity", timePeriod),
	};
};

const useMLByDate = (chartType: keyof typeof chartTypes, timePeriod: TimePeriod) => {
	const insights = useInsightsByDateRange(timePeriod.start_date, timePeriod.end_date);

	const data = transormFullPostDataForML(insights);

	const chartTypeData = chartTypes[chartType];

	const [includeToday] = useState<boolean>(false);

	const analysis = useMemo(() => {
		const dataWithToday = chartTypeData.mldata(data);
		const dataWithouToday = dataWithToday.slice(0, dataWithToday.length - 1);
		if (includeToday) {
			const analysis = analyzeTrendWithLinearRegression(dataWithToday);
			return {
				dataWithCorrectedTrend: analysis.trend,
				slope: analysis.slope,
				nextValue: analysis.nextValue,
			};
		} else {
			const analysis = analyzeTrendWithLinearRegression(dataWithouToday);
			return {
				dataWithCorrectedTrend: analysis.trend.concat(analysis.nextValue),
				slope: analysis.slope,
				nextValue: analysis.nextValue,
			};
		}
	}, [data, chartTypeData, includeToday]);

	return [analysis, insights, chartTypeData] as const;
};

export default useMLByDate;
