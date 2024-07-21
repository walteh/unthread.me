import { useMemo, useState } from "react";

import { analyzeTrendWithLinearRegression, InsightsByDate, MLData, transormFullDataForML } from "@src/lib/ml";
import { TimePeriod } from "@src/threadsapi/types";

import { useInsightsByDateRange } from "./useInsightsByDate";

export const chartTypes = {
	"user views": {
		name: "user views",
		color: "#1C64F2",
		mldata: (data: MLData) => data.userViewsData,
		isbd: (data: InsightsByDate) => data.totalUserViews,
	},
	"post views": {
		name: "post likes",
		color: "#EF4444",
		mldata: (data: MLData) => data.viewsData,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_views,
	},
	"post likes": {
		name: "post likes",
		color: "#EF4444",
		mldata: (data: MLData) => data.likesData,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_likes,
	},
	"post replies": {
		name: "post replies",
		color: "#10B981",
		mldata: (data: MLData) => data.repliesData,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_replies,
	},
	"post reposts": {
		name: "post reposts",
		color: "#F59E0B",
		mldata: (data: MLData) => data.repostsData,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_reposts,
	},

	"post quotes": {
		name: "post quotes",
		color: "#3B82F6",
		mldata: (data: MLData) => data.quotesData,
		isbd: (data: InsightsByDate) => data.cumlativePostInsights.total_quotes,
	},
};

export const useAllMlData = (timePeriod: TimePeriod): Record<keyof typeof chartTypes, ReturnType<typeof useMLByDate>> => {
	return {
		"user views": useMLByDate("user views", timePeriod),
		"post views": useMLByDate("post views", timePeriod),
		"post likes": useMLByDate("post likes", timePeriod),
		"post replies": useMLByDate("post replies", timePeriod),
		"post reposts": useMLByDate("post reposts", timePeriod),
		"post quotes": useMLByDate("post quotes", timePeriod),
	};
};

const useMLByDate = (chartType: keyof typeof chartTypes, timePeriod: TimePeriod) => {
	const insights = useInsightsByDateRange(timePeriod.start_date, timePeriod.end_date);

	const data = transormFullDataForML(insights);

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
