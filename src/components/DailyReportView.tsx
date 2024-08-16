import { FC, useState } from "react";

import { useDaily, useMonthly, useWeekly } from "@src/client/hooks/useInsightsByDate";
import { AggregatedInsights, formatNumber, getDayOfWeek, InsightsByDate } from "@src/lib/ml";

const InsightsRow: FC<{
	date: string;
	insights: InsightsByDate;
	aggregateFunc: (ibd: InsightsByDate) => AggregatedInsights;
	viewType: string;
}> = ({ date, insights, aggregateFunc, viewType }) => {
	const aggregated = aggregateFunc(insights);
	return (
		<tr className="">
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-nowrap text-center font-mono">{date}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">{insights.totalUserViews}</td>
			{viewType !== "replies" && (
				<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
					{insights.cumlativePostInsights.total_posts}
				</td>
			)}
			{viewType !== "posts" && (
				<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
					{insights.cumlativeReplyInsights.total_posts}
				</td>
			)}
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">{aggregated.total_views}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">{aggregated.total_likes}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">{aggregated.total_replies}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">{aggregated.total_reposts}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">{aggregated.total_quotes}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{formatNumber(aggregated.engegementRate)}x
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{formatNumber(aggregated.reachRate)}x
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{formatNumber(aggregated.activityRate)}x
			</td>
		</tr>
	);
};

export default function DailyReportView() {
	const [timeframe, setTimeframe] = useState("daily");
	const [viewType, setViewType] = useState("combined");

	const weekly = useWeekly();
	const daily = useDaily();
	const monthly = useMonthly();

	const getInsights = () => {
		switch (timeframe) {
			case "weekly":
				return weekly;
			case "monthly":
				return monthly;
			default:
				return daily;
		}
	};

	const allInsights = getInsights();
	const dates = Object.keys(allInsights);

	return (
		<div className="sm:p-6 min-h-screen">
			<div className="flex mb-4 justify-between items-center w-full">
				<div className="relative w-full sm:w-1/2 flex items-center space-x-4">
					<select
						value={timeframe}
						onChange={(e) => {
							setTimeframe(e.target.value);
						}}
						className="rounded-full py-2 px-4 text-gray-900 shadow-2xl sm:text-sm sm:leading-6 font-mono bg-gray-50 border-4 w-32"
					>
						<option value="daily">daily</option>
						<option value="weekly">weekly</option>
						<option value="monthly">monthly</option>
					</select>
					<select
						value={viewType}
						onChange={(e) => {
							setViewType(e.target.value);
						}}
						className="rounded-full py-2 px-4 text-gray-900 shadow-2xl sm:text-sm sm:leading-6 font-mono bg-gray-50 border-4 w-40"
					>
						<option value="combined">combined</option>
						<option value="posts">posts only</option>
						<option value="replies">replies only</option>
					</select>
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl">
					<thead>
						<tr>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700" rowSpan={2}>
								date
							</th>

							<th className="text-right p-4 border-b-2 border-gray-200 dark:border-gray-700" rowSpan={2}>
								user views
							</th>
							{viewType !== "replies" && (
								<th className="text-right p-4 border-b-2 border-gray-200 dark:border-gray-700" rowSpan={2}>
									posts
								</th>
							)}
							{viewType !== "posts" && (
								<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700" rowSpan={2}>
									replies
								</th>
							)}
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700" colSpan={8}>
								metrics
							</th>
						</tr>
						<tr>
							<th className="text-right p-4 border-b-2 border-gray-200 dark:border-gray-700">views</th>
							<th className="text-right p-4 border-b-2 border-gray-200 dark:border-gray-700">likes</th>
							<th className="text-right p-4 border-b-2 border-gray-200 dark:border-gray-700">replies</th>
							<th className="text-right p-4 border-b-2 border-gray-200 dark:border-gray-700">reposts</th>
							<th className="text-right p-4 border-b-2 border-gray-200 dark:border-gray-700">quotes</th>
							<th className="text-right p-4 border-b-2 border-gray-200 dark:border-gray-700">engagement</th>
							<th className="text-right p-4 border-b-2 border-gray-200 dark:border-gray-700">reach</th>
							<th className="text-right p-4 border-b-2 border-gray-200 dark:border-gray-700">activity</th>
						</tr>
					</thead>
					<tbody>
						{dates.map((date) => (
							<InsightsRow
								key={date}
								date={timeframe === "daily" ? `${date} - ${getDayOfWeek(date)}` : date}
								insights={allInsights[date]}
								aggregateFunc={(ibd: InsightsByDate) => {
									if (viewType === "posts") {
										return ibd.cumlativePostInsights;
									} else if (viewType === "replies") {
										return ibd.cumlativeReplyInsights;
									} else {
										return ibd.combinedInsights;
									}
								}}
								viewType={viewType}
							/>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
