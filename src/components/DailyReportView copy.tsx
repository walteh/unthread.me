import { useMemo, useState } from "react";

import useInsightsByDate from "@src/client/hooks/useInsightsByDate";

function percentChange(a: number, b: number): number {
	const change = Math.round(((a - b) / b) * 10000) / 100;
	return change;
}

const ONE_DAY = 1000 * 60 * 60 * 24;

const Day: React.FC<{ date: Date }> = ({ date }) => {
	const today = useInsightsByDate(date);

	const yesterday = useInsightsByDate(new Date(date.getTime() - ONE_DAY * 1));

	const lastWeek = useInsightsByDate(new Date(date.getTime() - ONE_DAY * 6));

	const secondLastWeek = useInsightsByDate(new Date(date.getTime() - ONE_DAY * 13));

	const thirdLastWeek = useInsightsByDate(new Date(date.getTime() - ONE_DAY * 20));
	// const viewsLastWeek = useCacheStore((state) => state.user_insights?.data?.views?.values[6]);

	const mem = useMemo(() => {
		const stats = [
			{
				name: "total views",
				value: today.totalUserViews,
				changeFromYesterday: percentChange(today.totalUserViews, yesterday.totalUserViews),
				changeFromLastWeek: percentChange(today.totalUserViews, lastWeek.totalUserViews),
				changeFromSecondLastWeek: percentChange(today.totalUserViews, secondLastWeek.totalUserViews),
				changeFromThirdLastWeek: percentChange(today.totalUserViews, thirdLastWeek.totalUserViews),
			},
			{
				name: "likes",
				value: today.cumlativePostInsights.total_likes,
				changeFromYesterday: percentChange(today.cumlativePostInsights.total_likes, yesterday.cumlativePostInsights.total_likes),
				changeFromLastWeek: percentChange(today.cumlativePostInsights.total_likes, lastWeek.cumlativePostInsights.total_likes),
				changeFromSecondLastWeek: percentChange(
					today.cumlativePostInsights.total_likes,
					secondLastWeek.cumlativePostInsights.total_likes,
				),
				changeFromThirdLastWeek: percentChange(
					today.cumlativePostInsights.total_likes,
					thirdLastWeek.cumlativePostInsights.total_likes,
				),
			},
			{
				name: "views",
				value: today.cumlativePostInsights.total_views,
				changeFromYesterday: percentChange(today.cumlativePostInsights.total_views, yesterday.cumlativePostInsights.total_views),
				changeFromLastWeek: percentChange(today.cumlativePostInsights.total_views, lastWeek.cumlativePostInsights.total_views),
				changeFromSecondLastWeek: percentChange(
					today.cumlativePostInsights.total_views,
					secondLastWeek.cumlativePostInsights.total_views,
				),
				changeFromThirdLastWeek: percentChange(
					today.cumlativePostInsights.total_views,
					thirdLastWeek.cumlativePostInsights.total_views,
				),
			},
			{
				name: "replies",
				value: today.cumlativePostInsights.total_replies,
				changeFromYesterday: percentChange(
					today.cumlativePostInsights.total_replies,
					yesterday.cumlativePostInsights.total_replies,
				),
				changeFromLastWeek: percentChange(today.cumlativePostInsights.total_replies, lastWeek.cumlativePostInsights.total_replies),
				changeFromSecondLastWeek: percentChange(
					today.cumlativePostInsights.total_replies,
					secondLastWeek.cumlativePostInsights.total_replies,
				),
				changeFromThirdLastWeek: percentChange(
					today.cumlativePostInsights.total_replies,
					thirdLastWeek.cumlativePostInsights.total_replies,
				),
			},
			{
				name: "reposts",
				value: today.cumlativePostInsights.total_reposts,
				changeFromYesterday: percentChange(
					today.cumlativePostInsights.total_reposts,
					yesterday.cumlativePostInsights.total_reposts,
				),
				changeFromLastWeek: percentChange(today.cumlativePostInsights.total_reposts, lastWeek.cumlativePostInsights.total_reposts),
				changeFromSecondLastWeek: percentChange(
					today.cumlativePostInsights.total_reposts,
					secondLastWeek.cumlativePostInsights.total_reposts,
				),
				changeFromThirdLastWeek: percentChange(
					today.cumlativePostInsights.total_reposts,
					thirdLastWeek.cumlativePostInsights.total_reposts,
				),
			},
			{
				name: "quotes",
				value: today.cumlativePostInsights.total_quotes,
				changeFromYesterday: percentChange(today.cumlativePostInsights.total_quotes, yesterday.cumlativePostInsights.total_quotes),
				changeFromLastWeek: percentChange(today.cumlativePostInsights.total_quotes, lastWeek.cumlativePostInsights.total_quotes),
				changeFromSecondLastWeek: percentChange(
					today.cumlativePostInsights.total_quotes,
					secondLastWeek.cumlativePostInsights.total_quotes,
				),
				changeFromThirdLastWeek: percentChange(
					today.cumlativePostInsights.total_quotes,
					thirdLastWeek.cumlativePostInsights.total_quotes,
				),
			},
		];

		return stats;
	}, [today, yesterday, lastWeek, secondLastWeek, thirdLastWeek]);

	return (
		<div className="p-6 bg-gray-100 rounded-lg shadow-md space-y-6">
			<h1 className="text-3xl font-bold text-gray-900">Daily Report for {date.toDateString()}</h1>
			{mem.map((stat) => (
				<div key={stat.name} className="p-4 bg-white rounded-lg shadow-md">
					<h2 className="text-xl font-bold text-gray-700">{stat.name}</h2>
					<p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
					<div className="mt-2">
						<p className="text-sm text-gray-600">
							Change from yesterday:{" "}
							<span className={stat.changeFromYesterday > 0 ? "text-green-500" : "text-red-500"}>
								{stat.changeFromYesterday}%
							</span>
						</p>
						<p className="text-sm text-gray-600">
							Change from last week:{" "}
							<span className={stat.changeFromLastWeek > 0 ? "text-green-500" : "text-red-500"}>
								{stat.changeFromLastWeek}%
							</span>
						</p>
						<p className="text-sm text-gray-600">
							Change from second last week:{" "}
							<span className={stat.changeFromSecondLastWeek > 0 ? "text-green-500" : "text-red-500"}>
								{stat.changeFromSecondLastWeek}%
							</span>
						</p>
						<p className="text-sm text-gray-600">
							Change from third last week:{" "}
							<span className={stat.changeFromThirdLastWeek > 0 ? "text-green-500" : "text-red-500"}>
								{stat.changeFromThirdLastWeek}%
							</span>
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default function DailyReportView() {
	const [date, setDate] = useState(new Date());

	console.log("date", date);

	return (
		<div className="bg-gray-50 dark:bg-gray-900">
			<div className="py-12 sm:py-16 lg:py-24">
				{/* transition out to the right, and in from the left */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate__animated animate__slideInLeft">
					<Day date={date} />
				</div>

				{/* arrows to move between days  */}
				<div className="mt-8 flex justify-center">
					<button
						onClick={() => {
							setDate((d) => new Date(d.getTime() - ONE_DAY * 1));
						}}
						className="bg-white dark:bg-gray-800 dark:text-white text-gray-900 px-4 py-2 rounded-md shadow-sm"
					>
						Previous day
					</button>
					<button
						onClick={() => {
							setDate((d) => new Date(d.getTime() + ONE_DAY * 1));
						}}
						className="bg-white dark:bg-gray-800 dark:text-white text-gray-900 px-4 py-2 rounded-md shadow-sm"
					>
						Next day
					</button>
				</div>
			</div>
		</div>
	);
}
