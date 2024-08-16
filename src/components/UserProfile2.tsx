import { useMemo, useState } from "react";

import useCacheStore from "@src/client/hooks/useCacheStore";
import { useUserEngagementRate } from "@src/client/hooks/useEngagementRate";
import useMLByDate from "@src/client/hooks/useMLByDate";
import useModalStore from "@src/client/hooks/useModalStore";
import { useAllThreadsRefresher, useLast2DaysThreadsRefresher, useUserDataRefresher } from "@src/client/hooks/useRefreshers";
import { useMyReplyList } from "@src/client/hooks/useThreadList";
import useThreadsListSortedByDate from "@src/client/hooks/useThreadsListByDate";
import { useTimePeriodLastNDaysFromToday } from "@src/client/hooks/useTimePeriod";
import useTokenStore from "@src/client/hooks/useTokenStore";
import useUnseenChanges from "@src/client/hooks/useUnseenChanges";
import useUserInsights from "@src/client/hooks/useUserInsights";
import reply_store from "@src/client/reply_store";
import thread_store from "@src/client/thread_store";
import { handleDownloadReplies, handleDownloadThreads } from "@src/lib/download";
import { formatNumber, getDateStringInPacificTime, getTimeInPacificTimeWithVeryPoorPerformance } from "@src/lib/ml";

import ChangesTable from "./ChangesTable";
import DailyReportView from "./DailyReportView";
import Modal from "./Modal";
import UserInsightsChartView2 from "./UserInsightsChartView2";
import UserThreadsView from "./UserThreadsView";
import WordSegmentLineChart from "./WordSegmentLineChart";

const Loader = () => (
	<div className="flex justify-center items-center">
		<div className="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-4 w-4"></div>
	</div>
);

export default function UserProfile2() {
	const [profile] = useCacheStore((state) => [state.user_profile]);
	const profileRefreshedAt = useCacheStore((state) => state.user_profile_refreshed_at);
	const [insights] = useUserInsights();
	const [threads] = useThreadsListSortedByDate();
	const replies = useMyReplyList();
	const today = getDateStringInPacificTime(new Date());

	const [engagement, reach, activity] = useUserEngagementRate();

	const clearToken = useTokenStore((state) => state.clearTokens);

	const viewsToday =
		insights.views_by_day.filter((v) => {
			const date = getDateStringInPacificTime(new Date(v.label));
			return date === today;
		})[0]?.value || 0;

	const [refreshLast2DayThreads, refreshLast2DayThreadsLoading, refreshLast2DayThreadsErr] = useLast2DaysThreadsRefresher();
	const [refreshAllThreads, refreshAllThreadsLoading, refreshAllThreadsErr] = useAllThreadsRefresher();
	const [refreshUserData, refreshUserDataLoading, refreshUserDataError] = useUserDataRefresher();

	const clearUser = useCacheStore((state) => state.clearUserData);

	const last30Days = useTimePeriodLastNDaysFromToday(30);

	const [last30Days_analysis, ,] = useMLByDate("user views", last30Days);

	const stats = [
		{ label: "followers", value: formatNumber(insights.total_followers), real_value: insights.total_followers, download_func: null },
		{ label: "post threads", value: formatNumber(threads.length), real_value: threads.length, download_func: handleDownloadThreads },
		{ label: "reply threads", value: formatNumber(replies.length), real_value: replies.length, download_func: handleDownloadReplies },
		{ label: "all time views", value: formatNumber(insights.total_views), real_value: insights.total_views, download_func: null },
	];

	const secondaryStats = [
		{ label: "all time likes", value: formatNumber(insights.total_likes), real_value: insights.total_likes },
		{ label: "all time replies", value: formatNumber(insights.total_replies), real_value: insights.total_replies },
		{ label: "all time reposts", value: formatNumber(insights.total_reposts), real_value: insights.total_reposts },
		{ label: "all time quotes", value: formatNumber(insights.total_quotes), real_value: insights.total_quotes },
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
			label: "threads last 2 days",
			action: refreshLast2DayThreads,
			isLoading: refreshLast2DayThreadsLoading,
			error: refreshLast2DayThreadsErr,
		},

		{
			label: "all threads (slow)",
			action: refreshAllThreads,
			isLoading: refreshAllThreadsLoading,
			error: refreshAllThreadsErr,
		},
	];

	const engagmentStats = [
		{ label: "engagement", value: formatNumber(engagement), sub: "interactions / followers" },
		{ label: "reach", value: formatNumber(reach), sub: "views / followers" },
		{ label: "activity", value: formatNumber(activity), sub: "interactions / views" },
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
			action: () => {
				thread_store.clearThreads();
				reply_store.clearThreads();
			},
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

	const changes = useUnseenChanges();
	const [setOpenModal] = useModalStore((state) => [state.setOpen]);
	// const [openModal] = useModalStore((state) => [state.open]);

	// useEffect(() => {
	// 	if (changes.length > 0 && !openModal) {
	// 		setCurrentTab(<ChangesTable />);
	// 		setOpenModal(true);
	// 	}
	// }, [changes, openModal, setOpenModal]);

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
		<div className="font-rounded flex justify-center flex-col items-center text-gray-900 ">
			<button
				onClick={() => {
					setCurrentTab(<ChangesTable />);
					setOpenModal(true);
				}}
				className="mb-3 flex justify-around px-3 py-1 font-rounded rounded-xl backdrop-blur-2xl bg-white bg-opacity-70   text-xs active:scale-x-95 hover:scale-105 hover:shadow-lg dark:shadow-gray-500 dark:hover:shadow-gray-500  active:shadow-sm  font-semibold shadow-md  transform transition duration-200 ease-in-out"
			>
				new alpha changes
				<div className="ml-2">
					<span className="text-xs font-bold">{changes.filter((x) => !x.seen).length}</span>
				</div>
			</button>
			<div className="rounded-xl backdrop-blur-2xl bg-white bg-opacity-20 mx-4 sm:max-w-screen-lg mb-2">
				<h2 className="sr-only" id="profile-overview-title">
					Profile Overview
				</h2>
				<div className="p-6 ">
					<div className="sm:flex sm:items-center sm:justify-center">
						<div className=" flex justify-around sm:mt-0">
							{profile ? (
								<div className="flex space-x-5">
									<div>
										<img className="h-20 w-20 rounded-xl" src={profile.threads_profile_picture_url} alt="" />
									</div>
									<div className=" text-center sm:text-left   flex items-center flex-col justify-around  dark:text-white ">
										<button
											onClick={() => {
												window.open(`https://threads.net/@${profile.username}`, "_blank");
											}}
											className={
												"truncate max-w-36 sm:max-w-96 mb-1 shadow-sm font-bold inline-flex items-center gap-x-1.5 rounded-full bg-black dark:bg-white px-3 py-1 text-lg  text-white dark:text-black font-rounded  hover:scale-115 transform transition duration-200 ease-in-out"
											}
										>
											{" "}
											<img width={15} className="dark:hidden -mr-2" src={"./threads-logo-white.svg"}></img>
											<img
												width={15}
												className=" hidden dark:block -mr-2"
												src={"./threads-logo-black.svg"}
											></img>{" "}
											<span className="truncate"></span>
											{profile.username}
										</button>
										<p className="text-md font-bold">{getDateStringInPacificTime(new Date(profileRefreshedAt))} </p>
										<p className="text-xs font-bold">
											{getTimeInPacificTimeWithVeryPoorPerformance(new Date(profileRefreshedAt))}
										</p>
									</div>
								</div>
							) : (
								<div>
									<p className="dark:text-white">⚠️ reload user data</p>
								</div>
							)}
						</div>
					</div>
				</div>

				<div>
					<div className="grid sm:grid-cols-3 gap-2 px-8 pt-0 pb-4">
						{refreshers.map((tab) => (
							<button
								key={tab.label}
								onClick={tab.action}
								className="flex justify-around px-5 py-3 font-rounded rounded-xl backdrop-blur-2xl bg-white bg-opacity-70  text-xs active:scale-x-95 hover:scale-105 hover:shadow-lg dark:shadow-gray-500 dark:hover:shadow-gray-500 active:shadow-sm  font-semibold shadow-md  transform transition duration-200 ease-in-out "
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
								className="flex justify-around px-5 py-3 font-rounded rounded-xl backdrop-blur-2xl bg-white bg-opacity-70   text-xs active:scale-x-95 hover:scale-105 hover:shadow-lg dark:shadow-gray-500 dark:hover:shadow-gray-500  active:shadow-sm  font-semibold shadow-md  transform transition duration-200 ease-in-out"
							>
								<div className="flex  drop-shadow-2xl dark:drop-shadow-gray-500">
									{tab.isLoading ? <Loader /> : tab.error ? "❌" : tab.emoji} <span className="ml-2">{tab.label}</span>
								</div>
							</button>
						))}
					</div>
				</div>

				<div className={`grid grid-cols-2 gap-4 divide-gray-200 border-gray-200 px-4 sm:grid-cols-${stats.length}`}>
					{stats.map((stat) => (
						<div key={stat.label}>
							<div className=" px-2 py-1 text-center text-sm font-medium bg-gray-200 rounded-xl group flex-col flex groupbackdrop-blur-lg bg-opacity-50 shadow-inner  relative">
								<div className="group-hover:hidden">
									<span className="text-md font-mono ">{stat.value}</span>
								</div>
								<div className="hidden group-hover:block">
									<span className="text-md  font-mono">{stat.real_value.toLocaleString()}</span>
								</div>
								<span className="text-xs text-gray-600">{stat.label}</span>
								{stat.download_func ? (
									<button
										onClick={() => {
											void stat.download_func();
										}}
										className="text-xs text-gray-500 absolute active:scale-x-95 hover:scale-105"
									>
										⬇️
									</button>
								) : null}
							</div>
						</div>
					))}
				</div>

				<div className={`grid grid-cols-2 gap-4 divide-gray-200 border-gray-200 px-4 sm:grid-cols-${secondaryStats.length} mt-3 `}>
					{secondaryStats.map((stat) => (
						<div key={stat.label}>
							<div className=" px-2 py-1 text-center text-sm font-medium bg-gray-200 rounded-xl group flex-col flex groupbackdrop-blur-lg bg-opacity-50 shadow-inner  ">
								<div className="group-hover:hidden">
									<span className="text-md font-mono ">{stat.value}</span>
								</div>
								<div className="hidden group-hover:block">
									<span className="text-md  font-mono">{stat.real_value.toLocaleString()}</span>
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
							<div className=" px-2 py-1 text-center text-sm font-medium bg-gray-200 rounded-xl  flex-col flex group backdrop-blur-lg bg-opacity-50 shadow-inner">
								{stat.is_trend ? (
									<div>
										<span className="text-md font-mono ">
											{stat.real_value > 0 ? "+" : "-"}
											{Math.abs(stat.real_value)} <span className="text-xs font-rounded">/ day</span>
										</span>
									</div>
								) : (
									<div>
										<div className=" group-hover:hidden">
											<span className="text-md font-mono ">{stat.value}</span>
										</div>
										<div className="hidden group-hover:block">
											<span className="text-md   font-mono">{stat.real_value.toLocaleString()}</span>
										</div>
									</div>
								)}

								<span className="text-xs text-gray-600">{stat.label}</span>
							</div>
						</div>
					))}
				</div>

				<div
					className={`grid grid-cols-2 gap-4 divide-gray-200 border-gray-200 px-4 sm:grid-cols-${engagmentStats.length} mt-3 justify-center`}
				>
					{engagmentStats.map((stat) => (
						<div key={stat.label}>
							<div className=" px-2 py-1 text-center text-sm font-medium bg-gray-200 rounded-xl  flex-col flex group backdrop-blur-lg bg-opacity-50 shadow-inner">
								<div>
									<span className="text-md font-mono ">
										{stat.value}
										<span className="text-xs font-rounded">x</span>
									</span>
								</div>

								<span className="text-xs text-gray-600">all time {stat.label}</span>
								<span className="text-xs text-gray-500" style={{ fontSize: ".5rem" }}>
									{stat.sub}
								</span>
							</div>
						</div>
					))}
				</div>

				<div className={`grid grid-cols-2 gap-4 sm:grid-cols-${items.length} p-4`}>
					{items.map((tab) => (
						<button
							key={tab.label}
							onClick={() => {
								setCurrentTab(tab.comp());
								setOpenModal(true);
							}}
							className="px-6 py-5 text-center text-sm font-medium  rounded-xl backdrop-blur-2xl bg-white bg-opacity-70  active:scale-x-95 hover:scale-105 hover:shadow-lg dark:shadow-gray-500 dark:hover:shadow-gray-500 active:shadow-sm  shadow-md  transform transition duration-200 ease-in-out "
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
