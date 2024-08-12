import { FC } from "react";

import { useDaily } from "@src/client/hooks/useInsightsByDate";
import { formatNumber, getDayOfWeek, InsightsByDate } from "@src/lib/ml";

const InsightsRow: FC<{ date: string; insights: InsightsByDate }> = ({ date, insights }) => {
	return (
		<tr className="">
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-nowrap text-center font-mono">{date}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-nowrap text-center font-mono">{getDayOfWeek(date)}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">{insights.totalUserViews}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{insights.cumlativePostInsights.total_posts}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{insights.cumlativePostInsights.total_views}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{insights.cumlativePostInsights.total_likes}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{insights.cumlativePostInsights.total_replies}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{insights.cumlativePostInsights.total_reposts}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{insights.cumlativePostInsights.total_quotes}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{formatNumber(insights.cumlativePostInsights.engegementRate)}x
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{formatNumber(insights.cumlativePostInsights.reachRate)}x
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{formatNumber(insights.cumlativePostInsights.activityRate)}x
			</td>

			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{insights.cumlativeReplyInsights.total_views}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{insights.cumlativeReplyInsights.total_likes}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{insights.cumlativeReplyInsights.total_replies}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{insights.cumlativeReplyInsights.total_reposts}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{insights.cumlativeReplyInsights.total_quotes}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{formatNumber(insights.cumlativeReplyInsights.engegementRate)}x
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{formatNumber(insights.cumlativeReplyInsights.reachRate)}x
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-right font-mono">
				{formatNumber(insights.cumlativeReplyInsights.activityRate)}x
			</td>
		</tr>
	);
};

export default function DailyReportView() {
	const allInsights = useDaily();
	const dates = Object.keys(allInsights);

	return (
		<div className="sm:p-6 min-h-screen">
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl">
					<thead>
						<tr>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700 " rowSpan={2}>
								date
							</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700" rowSpan={2}>
								day
							</th>
							<th className="text-right p-4 border-b-2 border-gray-200 dark:border-gray-700" rowSpan={2}>
								user views
							</th>
							<th className="text-right p-4 border-b-2 border-gray-200 dark:border-gray-700" rowSpan={2}>
								posts
							</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700" colSpan={8}>
								post metrics
							</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700" colSpan={8}>
								reply metrics
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
							<InsightsRow key={date} date={date} insights={allInsights[date]} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
