import { useMemo, useState } from "react";

import useCacheStore from "@src/client/hooks/useCacheStore";
import useMLByDate from "@src/client/hooks/useMLByDate";
import useModalStore from "@src/client/hooks/useModalStore";
import { useAllThreadsRefresher, useLast2DaysThreadsRefresher, useUserDataRefresher } from "@src/client/hooks/useRefreshers";
import useThreadsListSortedByDate from "@src/client/hooks/useThreadsListByDate";
import { useTimePeriodLastNDaysFromToday } from "@src/client/hooks/useTimePeriod";
import useTokenStore from "@src/client/hooks/useTokenStore";
import useUserInsights from "@src/client/hooks/useUserInsights";
import { formatNumber, getDateStringInPacificTime } from "@src/lib/ml";

import DailyReportView from "./DailyReportView";
import Modal from "./Modal";
import UserInsightsChartView2 from "./UserInsightsChartView2";
import UserThreadsView from "./UserThreadsView";
import WordSegmentLineChart from "./WordSegmentLineChart";

const Loader = () => (
	<div className="flex justify-center items-center h-full">
		<div className="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-4 w-4"></div>
	</div>
);

export default function UserProfile2() {
	const [profile] = useCacheStore((state) => [state.user_profile]);
	const [insights] = useUserInsights();
	const [threads] = useThreadsListSortedByDate();
	const today = getDateStringInPacificTime(new Date());

	const clearToken = useTokenStore((state) => state.clearTokens);

	// const threadsToday = threads.filter((thread) => {
	// 	const date = getDateStringInPacificTime(new Date(thread.media.timestamp));
	// 	return date === today;
	// });

	const viewsToday =
		insights.views_by_day.filter((v) => {
			const date = getDateStringInPacificTime(new Date(v.label));
			return date === today;
		})[0]?.value || 0;

	const [refreshLast2DayThreads, refreshLast2DayThreadsLoading, refreshLast2DayThreadsErr] = useLast2DaysThreadsRefresher();
	const [refreshAllThreads, refreshAllThreadsLoading, refreshAllThreadsErr] = useAllThreadsRefresher();
	const [refreshUserData, refreshUserDataLoading, refreshUserDataError] = useUserDataRefresher();

	const clearThreads = useCacheStore((state) => state.clearThreads);
	const clearUser = useCacheStore((state) => state.clearUserData);

	const last30Days = useTimePeriodLastNDaysFromToday(30);

	const [last30Days_analysis, ,] = useMLByDate("user views", last30Days);

	const stats = [
		{ label: "followers", value: formatNumber(insights.total_followers), real_value: insights.total_followers },
		{ label: "all time likes", value: formatNumber(insights.total_likes), real_value: insights.total_likes },
		{ label: "all time views", value: formatNumber(insights.total_views), real_value: insights.total_views },
		{ label: "all time threads", value: formatNumber(threads.length), real_value: threads.length },
	];

	const todayStats = [
		{
			label: "views today",
			value: formatNumber(viewsToday),
			real_value: viewsToday,
		},
		{
			label: "30 day trend",
			value: formatNumber(last30Days_analysis.slope),
			real_value: Math.round(last30Days_analysis.slope),
			is_trend: true,
		},
		{
			label: "projected",
			value: formatNumber(last30Days_analysis.nextValue),
			real_value: Math.round(last30Days_analysis.nextValue),
		},
	];

	const refreshers = [
		{
			label: "user data",
			action: refreshUserData,
			isLoading: refreshUserDataLoading,
			error: refreshUserDataError,
		},
		{
			label: "all threads (slow)",
			action: refreshAllThreads,
			isLoading: refreshAllThreadsLoading,
			error: refreshAllThreadsErr,
		},
		{
			label: "threads last 2 days",
			action: refreshLast2DayThreads,
			isLoading: refreshLast2DayThreadsLoading,
			error: refreshLast2DayThreadsErr,
		},
	];

	const reseters = [
		{
			label: "clear user data",
			action: clearUser,
			isLoading: false,
			error: false,
			emoji: "🗑️",
		},
		{
			label: "clear threads",
			action: clearThreads,
			isLoading: false,
			error: false,
			emoji: "🗑️",
		},
		{
			label: "sign out",
			action: clearToken,
			isLoading: false,
			error: false,
			emoji: "🔒",
		},
	];

	const [currentTab, setCurrentTab] = useState<React.ReactNode>(null);

	const [setOpenModal] = useModalStore((state) => [state.setOpen]);

	const items = useMemo(() => {
		return [
			{
				label: "daily 📋",
				comp: () => <DailyReportView />,
			},
			{
				label: "charts 📈",
				comp: () => <UserInsightsChartView2 />,
			},

			{
				label: "words 📊",
				comp: () => <WordSegmentLineChart />,
			},

			{
				label: "search 🔎",
				comp: () => <UserThreadsView />,
			},
		];
	}, []);

	// const item = items.find((item) => item.label === currentTab);

	return (
		<div className="font-rounded flex justify-center flex-col items-center">
			<div className="rounded-2xl backdrop-blur-2xl bg-white bg-opacity-20 mx-4 sm:max-w-screen-lg">
				<h2 className="sr-only" id="profile-overview-title">
					Profile Overview
				</h2>
				<div className="p-6 ">
					<div className="sm:flex sm:items-center sm:justify-center">
						<div className=" flex justify-around sm:mt-0">
							<div className="flex space-x-5">
								<div>
									<img className="h-14 w-14 rounded-xl" src={profile?.threads_profile_picture_url} alt="" />
								</div>
								<div className="text-center sm:text-left  max-w-72 flex items-center flex-col justify-start text-gray-900 dark:text-white">
									<p className="truncate text-2xl font-bold font-rounded  max-w-72 ">@{profile?.username}</p>
									<p>{getDateStringInPacificTime(new Date())}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div>
					<div className="grid sm:grid-cols-3 gap-2 p-8 pt-0">
						{refreshers.map((tab) => (
							<button
								key={tab.label}
								onClick={tab.action}
								className="flex justify-around px-5 py-3 font-rounded rounded-2xl backdrop-blur-2xl bg-white bg-opacity-50   text-md font-semibold shadow-md hover:scale-110 transform transition duration-200 ease-in-out hover:shadow-xl"
							>
								<div className="flex">
									{tab.isLoading ? <Loader /> : tab.error ? "❌" : "🔄"} <span className="ml-2">{tab.label}</span>
								</div>
							</button>
						))}

						{reseters.map((tab) => (
							<button
								key={tab.label}
								onClick={tab.action}
								className="flex justify-around px-5 py-3 font-rounded rounded-2xl backdrop-blur-2xl bg-white bg-opacity-50   text-md font-semibold shadow-md hover:scale-110 transform transition duration-200 ease-in-out hover:shadow-xl"
							>
								<div className="flex">
									{tab.isLoading ? <Loader /> : tab.error ? "❌" : tab.emoji} <span className="ml-2">{tab.label}</span>
								</div>
							</button>
						))}
					</div>
				</div>

				<div className={`grid grid-cols-2 gap-4 divide-gray-200 border-gray-200 px-4 lg:grid-cols-${stats.length}`}>
					{stats.map((stat) => (
						<div key={stat.label}>
							<div className=" px-4 py-3 text-center text-sm font-medium bg-gray-200 rounded-xl  flex-col flex group hover:bg-gray-200 backdrop-blur-lg bg-opacity-50 shadow-md">
								<div className=" group-hover:hidden">
									<span className="text-md font-mono text-gray-900">{stat.value}</span>
								</div>
								<div className="hidden group-hover:block">
									<span className="text-md  text-gray-900 font-mono">{stat.real_value.toLocaleString()}</span>
								</div>
								<span className="text-xs text-gray-600">{stat.label}</span>
							</div>
						</div>
					))}
				</div>
				<div
					className={`grid grid-cols-2 gap-4 divide-gray-200 border-gray-200 px-4 sm:grid-cols-${todayStats.length} mt-3 justify-center`}
				>
					{todayStats.map((stat) => (
						<div key={stat.label}>
							<div className=" px-4 py-3 text-center text-sm font-medium bg-gray-200 rounded-xl  flex-col flex group hover:bg-gray-200 backdrop-blur-lg bg-opacity-50 shadow-md">
								{stat.is_trend ? (
									<div>
										<span className="text-md font-mono text-gray-900">
											{stat.real_value > 0 ? "➕" : "➖"} {stat.value} <span className="text-xs">/ day</span>
										</span>
									</div>
								) : (
									<div>
										<div className=" group-hover:hidden">
											<span className="text-md font-mono text-gray-900">{stat.value}</span>
										</div>
										<div className="hidden group-hover:block">
											<span className="text-md  text-gray-900 font-mono">{stat.real_value.toLocaleString()}</span>
										</div>
									</div>
								)}

								<span className="text-xs text-gray-600">{stat.label}</span>
							</div>
						</div>
					))}
				</div>

				<div className={`grid grid-cols-2 gap-4 lg:grid-cols-${items.length} p-4`}>
					{items.map((tab) => (
						<button
							key={tab.label}
							onClick={() => {
								setCurrentTab(tab.comp());
								setOpenModal(true);
							}}
							className="px-6 py-5 text-center text-sm font-medium text-gray-600  rounded-2xl backdrop-blur-2xl bg-white bg-opacity-50  hover:scale-105 transform transition duration-200 ease-in-out hover:shadow-xl shadow-md "
						>
							{tab.label}
						</button>
					))}
				</div>
			</div>

			<Modal>{currentTab}</Modal>
		</div>
	);
}
