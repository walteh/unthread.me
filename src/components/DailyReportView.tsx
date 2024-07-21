import { FC } from "react";

import { useDaily } from "@src/client/hooks/useInsightsByDate";
import { InsightsByDate } from "@src/lib/ml";

const InsightsRow: FC<{ date: string; insights: InsightsByDate }> = ({ date, insights }) => {
	return (
		<tr className="bg-white dark:bg-gray-800">
			<td className="p-4 border-t border-gray-200 dark:border-gray-700">{date}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">{insights.totalUserViews}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">{insights.cumlativePostInsights.total_posts}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">{insights.cumlativePostInsights.total_views}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">{insights.cumlativePostInsights.total_likes}</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
				{insights.cumlativePostInsights.total_replies}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
				{insights.cumlativePostInsights.total_reposts}
			</td>
			<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">{insights.cumlativePostInsights.total_quotes}</td>
		</tr>
	);
};

export default function DailyReportView() {
	const allInsights = useDaily();
	const dates = Object.keys(allInsights);

	return (
		<div className="p-6 dark:bg-gray-900 min-h-screen">
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white dark:bg-gray-800 rounded-2xl">
					<thead>
						<tr>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">date</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">user views</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">posts</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">post views</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">post likes</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">post replies</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">post reposts</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">post quotes</th>
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
