import { FC } from "react";

import { useInsightsByAll } from "@src/client/hooks/useInsightsByDate";
import { getDateStringInPacificTime } from "@src/lib/ml";

const InsightsCard: FC<{ title: string; value: number }> = ({ title, value }) => {
	return (
		<div className="bg-white p-4 shadow rounded-lg">
			<h2 className="text-lg font-semibold">{title}</h2>
			<p className="text-2xl font-bold">{value}</p>
		</div>
	);
};

const now = new Date();

// Format the date to Pacific Time
// const options = {
// 	timeZone: "America/Los_Angeles",
// 	year: "numeric",
// 	//   month: '2-digit',
// 	//   day: '2-digit',
// 	//   hour: '2-digit',
// 	//   minute: '2-digit',
// 	//   second: '2-digit',
// 	hour12: false,
// };

const Day: React.FC = () => {
	const allInsights = useInsightsByAll();

	const formattedDate = getDateStringInPacificTime(now);

	const mySights = allInsights[formattedDate.slice(0, 10)];

	const myRelativeInsights = mySights.relativeInsights();

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			<h1 className="text-3xl font-bold mb-6">today {formattedDate}</h1>

			{/* <span>{JSON.stringify(mySights.dateInfo)}</span> */}
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
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
				<InsightsCard title="user views" value={mySights.totalUserViews} />
				<InsightsCard title="posts" value={mySights.cumlativePostInsights.total_posts} />
				<InsightsCard title="post views" value={mySights.cumlativePostInsights.total_views} />
				<InsightsCard title="post likes" value={mySights.cumlativePostInsights.total_likes} />
				<InsightsCard title="post replies" value={mySights.cumlativePostInsights.total_replies} />
				<InsightsCard title="post reposts" value={mySights.cumlativePostInsights.total_reposts} />
				<InsightsCard title="post quotes" value={mySights.cumlativePostInsights.total_quotes} />
			</div>
			<h1 className="text-3xl font-bold mb-6">one week ago {myRelativeInsights.one_week_ago.dateInfo.today}</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
				<InsightsCard title="user views" value={myRelativeInsights.one_week_ago.totalUserViews} />
				<InsightsCard title="posts" value={myRelativeInsights.one_week_ago.cumlativePostInsights.total_posts} />
				<InsightsCard title="post views" value={myRelativeInsights.one_week_ago.cumlativePostInsights.total_views} />
				<InsightsCard title="post likes" value={myRelativeInsights.one_week_ago.cumlativePostInsights.total_likes} />
				<InsightsCard title="post replies" value={myRelativeInsights.one_week_ago.cumlativePostInsights.total_replies} />
				<InsightsCard title="post reposts" value={myRelativeInsights.one_week_ago.cumlativePostInsights.total_reposts} />
				<InsightsCard title="post quotes" value={myRelativeInsights.one_week_ago.cumlativePostInsights.total_quotes} />
			</div>

			<h1 className="text-3xl font-bold mb-6">last month {myRelativeInsights.this_day_last_month.dateInfo.today}</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
				<InsightsCard title="user views" value={myRelativeInsights.this_day_last_month.totalUserViews} />
				<InsightsCard title="posts" value={myRelativeInsights.this_day_last_month.cumlativePostInsights.total_posts} />
				<InsightsCard title="post views" value={myRelativeInsights.this_day_last_month.cumlativePostInsights.total_views} />
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
