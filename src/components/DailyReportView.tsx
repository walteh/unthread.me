import { FC, useState } from "react";

import { useInsightsByAll } from "@src/client/hooks/useInsightsByDate";

const InsightsCard: FC<{ title: string; value: number }> = ({ title, value }) => {
	return (
		<div className="bg-white p-4 shadow rounded-lg">
			<h2 className="text-lg font-semibold">{title}</h2>
			<p className="text-2xl font-bold">{value}</p>
		</div>
	);
};

const Day: React.FC = () => {
	const [date] = useState<Date>(new Date());
	// const [trends, setTrends] = useState<Record<string, { trend: number[]; nextValue: number }>>({});
	// const [anomalies, setAnomalies] = useState<Record<string, boolean[]>>({});

	// const [trendsd, setTrendsd] = useState<Record<string, { trend: number[]; nextValue: number }>>({});
	// const [anomaliesd, setAnomaliesd] = useState<Record<string, boolean[]>>({});

	// const [running, setRunning] = useState<boolean>(false);

	const allInsights = useInsightsByAll();

	const myDateString = date.toISOString().slice(0, 10);

	const mySights = allInsights[myDateString];

	const myRelativeInsights = mySights.relativeInsights();

	// useEffect(() => {
	// 	const data = transormFullDataForML(allInsights);
	// 	const datad = transformDataForML(allInsights, date);
	// 	const analyzeAllMetrics = () => {
	// 		const trends = {
	// 			views: analyzeTrendWithLinearRegression(data.viewsData),
	// 			likes: analyzeTrendWithLinearRegression(data.likesData),
	// 			replies: analyzeTrendWithLinearRegression(data.repliesData),
	// 			reposts: analyzeTrendWithLinearRegression(data.repostsData),
	// 			quotes: analyzeTrendWithLinearRegression(data.quotesData),
	// 		};

	// 		const anomalies = {
	// 			views: detectAnomalies(data.viewsData),
	// 			likes: detectAnomalies(data.likesData),
	// 			replies: detectAnomalies(data.repliesData),
	// 			reposts: detectAnomalies(data.repostsData),
	// 			quotes: detectAnomalies(data.quotesData),
	// 		};

	// 		setTrends(trends);
	// 		setAnomalies(anomalies);

	// 		const dtrends = {
	// 			views: analyzeTrendWithLinearRegression(datad.viewsData),
	// 			likes: analyzeTrendWithLinearRegression(datad.likesData),
	// 			replies: analyzeTrendWithLinearRegression(datad.repliesData),
	// 			reposts: analyzeTrendWithLinearRegression(datad.repostsData),
	// 			quotes: analyzeTrendWithLinearRegression(datad.quotesData),
	// 		};

	// 		const danomalies = {
	// 			views: detectAnomalies(datad.viewsData),
	// 			likes: detectAnomalies(datad.likesData),
	// 			replies: detectAnomalies(datad.repliesData),
	// 			reposts: detectAnomalies(datad.repostsData),
	// 			quotes: detectAnomalies(datad.quotesData),
	// 		};

	// 		setTrendsd(dtrends);
	// 		setAnomaliesd(danomalies);
	// 	};

	// 	if (!running) {
	// 		setRunning(true);

	// 		analyzeAllMetrics();
	// 	}
	// }, [allInsights, date, running]);

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			<h1 className="text-3xl font-bold mb-6">today</h1>
			{/* <div className="mb-4">
				<label htmlFor="date-select" className="block text-sm font-medium text-gray-700">
					Select Date
				</label>
				<select
					id="date-select"
					value={date.toISOString().slice(0, 10)}
					onChange={(e) => {
						setDate(new Date(e.target.value));
					}}
					className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
				>
					<option value="today">Today</option>
					<option value="one_week_ago">One Week Ago</option>
					<option value="two_weeks_ago">Two Weeks Ago</option>
					<option value="three_weeks_ago">Three Weeks Ago</option>
					<option value="four_weeks_ago">Four Weeks Ago</option>
					<option value="five_weeks_ago">Five Weeks Ago</option>
					<option value="six_weeks_ago">Six Weeks Ago</option>
					<option value="this_day_last_month">This Day Last Month</option>
				</select>
			</div> */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				<InsightsCard title="user views" value={mySights.totalUserViews} />
				<InsightsCard title="post likes" value={mySights.cumlativePostInsights.total_likes} />
				<InsightsCard title="post replies" value={mySights.cumlativePostInsights.total_replies} />
				<InsightsCard title="post reposts" value={mySights.cumlativePostInsights.total_reposts} />
				<InsightsCard title="post quotes" value={mySights.cumlativePostInsights.total_quotes} />
			</div>
			<h1 className="text-3xl font-bold mb-6">one week ago</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				<InsightsCard title="user views" value={myRelativeInsights.one_week_ago.totalUserViews} />
				<InsightsCard title="post likes" value={myRelativeInsights.one_week_ago.cumlativePostInsights.total_likes} />
				<InsightsCard title="post replies" value={myRelativeInsights.one_week_ago.cumlativePostInsights.total_replies} />
				<InsightsCard title="post reposts" value={myRelativeInsights.one_week_ago.cumlativePostInsights.total_reposts} />
				<InsightsCard title="post quotes" value={myRelativeInsights.one_week_ago.cumlativePostInsights.total_quotes} />
			</div>

			<h1 className="text-3xl font-bold mb-6">last month</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				<InsightsCard title="user views" value={myRelativeInsights.this_day_last_month.totalUserViews} />
				<InsightsCard title="post likes" value={myRelativeInsights.this_day_last_month.cumlativePostInsights.total_likes} />
				<InsightsCard title="post replies" value={myRelativeInsights.this_day_last_month.cumlativePostInsights.total_replies} />
				<InsightsCard title="post reposts" value={myRelativeInsights.this_day_last_month.cumlativePostInsights.total_reposts} />
				<InsightsCard title="post quotes" value={myRelativeInsights.this_day_last_month.cumlativePostInsights.total_quotes} />
			</div>
			{/* <ThreadList threads={insightsData.threadsListWithInsights} /> */}

			{/* Display Trends and Anomalies */}
		</div>
	);
};

export default function DailyReportView() {
	return (
		<div className="bg-gray-50 dark:bg-gray-900">
			<Day />
		</div>
	);
}
