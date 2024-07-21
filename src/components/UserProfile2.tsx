import { useMemo, useState } from "react";

import useCacheStore from "@src/client/hooks/useCacheStore";
import useModalStore from "@src/client/hooks/useModalStore";
import { useAllThreadsRefresher, useLast2DaysThreadsRefresher, useUserDataRefresher } from "@src/client/hooks/useRefreshers";
import useThreadsListSortedByDate from "@src/client/hooks/useThreadsListByDate";
import useUserInsights from "@src/client/hooks/useUserInsights";
import { formatNumber } from "@src/lib/ml";

import DailyReportView from "./DailyReportView";
import Modal from "./Modal";
import UserInsightsChartView2 from "./UserInsightsChartView2";
import UserThreadsView from "./UserThreadsView";
import WordSegmentLineChart from "./WordSegmentLineChart";

const Loader = () => (
	<div className="flex justify-center items-center h-full mr-1">
		<div className="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-4 w-4"></div>
	</div>
);

export default function UserProfile2() {
	const [profile] = useCacheStore((state) => [state.user_profile]);
	const [insights] = useUserInsights();
	const [threads] = useThreadsListSortedByDate();

	const [refreshLast2DayThreads, refreshLast2DayThreadsLoading, refreshLast2DayThreadsErr] = useLast2DaysThreadsRefresher();
	const [refreshAllThreads, refreshAllThreadsLoading, refreshAllThreadsErr] = useAllThreadsRefresher();
	const [refreshUserData, refreshUserDataLoading, refreshUserDataError] = useUserDataRefresher();

	const clearThreads = useCacheStore((state) => state.clearThreads);

	const stats = [
		{ label: "followers", value: formatNumber(insights.total_followers), real_value: insights.total_followers },
		{ label: "all time likes", value: formatNumber(insights.total_likes), real_value: insights.total_likes },
		{ label: "all time views", value: formatNumber(insights.total_views), real_value: insights.total_views },
		{ label: "all time threads", value: formatNumber(threads.length), real_value: threads.length },
	];

	const refreshers = [
		{
			label: "user data",
			action: refreshUserData,
			isLoading: refreshUserDataLoading,
			error: refreshUserDataError,
		},
		{
			label: "all threads",
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
			<div className="rounded-2xl backdrop-blur-2xl bg-white bg-opacity-50 mx-4 sm:max-w-screen-lg">
				<h2 className="sr-only" id="profile-overview-title">
					Profile Overview
				</h2>
				<div className="p-6 ">
					<div className="sm:flex sm:items-center sm:justify-center">
						<div className=" flex justify-around sm:mt-0">
							<div className="sm:flex sm:space-x-5 ">
								<div className="flex-shrink-0">
									<img className="mx-auto h-20 w-20 rounded-xl" src={profile?.threads_profile_picture_url} alt="" />
								</div>
								<div className="text-center sm:text-left my-2 max-w-72 flex items-center flex-col">
									<p className="truncate text-3xl font-bold font-rounded text-gray-900 max-w-72 ">@{profile?.username}</p>
									<p className="mt-3 text-lg">🔄 cache</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div>
					<div className="grid grid-cols-3 gap-4 px-4">
						{refreshers.map((tab) => (
							<button
								key={tab.label}
								onClick={tab.action}
								className="flex px-2 py-3 m-5 font-rounded rounded-2xl backdrop-blur-2xl bg-white bg-opacity-50   text-md font-semibold shadow-md hover:scale-110 transform transition duration-200 ease-in-out hover:shadow-xl"
							>
								<div className="ml-3 flex text-xs">
									{tab.isLoading ? <Loader /> : "🔄"} {tab.label}
								</div>
							</button>
						))}
					</div>
				</div>

				<button
					onClick={() => {
						clearThreads();
					}}
					className="flex px-2 py-3 m-5 font-rounded rounded-2xl backdrop-blur-2xl bg-white bg-opacity-50   text-md font-semibold shadow-md hover:scale-110 transform transition duration-200 ease-in-out hover:shadow-xl"
				>
					clear cache
				</button>

				{/* <div
				className={`grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 lg:grid-cols-4 sm:divide-x sm:divide-y-0`}
			>
				{loaders.map((stat) => (
					<div key={stat.label} className="px-3 py-2 text-center text-xs font-small flex justify-center">
						{stat.data?.is_loading ? <Loader /> : "✅"} {stat.label}
					</div>
				))}
			</div> */}

				<div className={`grid grid-cols-2 gap-4 divide-gray-200 border-gray-200 px-4 lg:grid-cols-${stats.length}`}>
					{stats.map((stat) => (
						<div key={stat.label}>
							<div className=" px-4 py-3 text-center text-sm font-medium bg-gray-200 rounded-xl  flex-col flex group hover:bg-gray-200 backdrop-blur-lg bg-opacity-50">
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

				<div className={`grid grid-cols-2 gap-4 lg:grid-cols-${items.length} p-4`}>
					{items.map((tab) => (
						<button
							key={tab.label}
							onClick={() => {
								setCurrentTab(tab.comp());
								setOpenModal(true);
							}}
							className="px-6 py-5 text-center text-sm font-medium text-gray-600 bg-white   border-4 rounded-xl  hover:scale-110 transform transition duration-200 ease-in-out hover:shadow-xl shadow-md "
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
