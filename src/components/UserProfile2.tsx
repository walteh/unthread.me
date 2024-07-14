import { useMemo, useState } from "react";

import useCacheStore from "@src/client/hooks/useCacheStore";
import useModalStore from "@src/client/hooks/useModalStore";
import useThreadsListSortedByDate from "@src/client/hooks/useThreadsListByDate";
import useUserInsights from "@src/client/hooks/useUserInsights";

import DailyReportView from "./DailyReportView";
import Modal from "./Modal";
import UserInsightsChartView from "./UserInsightsChartView";
import UserThreadsView from "./UserThreadsView";
import WordSegmentLineChart from "./WordSegmentLineChart";

const formatNumber = (number: number) => {
	const formatter = Intl.NumberFormat("en", { notation: "compact" });
	return formatter.format(number);
};
const Loader = () => (
	<div className="flex justify-center items-center h-full mr-1">
		<div className="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-4 w-4"></div>
	</div>
);

export default function UserProfile2() {
	const [profile] = useCacheStore((state) => [state.user_profile]);
	const [insights] = useUserInsights();
	const [threads] = useThreadsListSortedByDate();

	const refresh = useCacheStore((state) => state.clearCache);

	const profileL = useCacheStore((state) => state.user_profile);
	const insightsL = useCacheStore((state) => state.user_insights);
	const threadsL = useCacheStore((state) => state.user_threads);
	const followerDemographicsL = useCacheStore((state) => state.user_follower_demographics);

	const stats = [
		{ label: "followers", value: formatNumber(insights.total_followers), real_value: insights.total_followers },
		{ label: "all time likes", value: formatNumber(insights.total_likes), real_value: insights.total_likes },
		{ label: "all time views", value: formatNumber(insights.total_views), real_value: insights.total_views },
		{ label: "all time threads", value: formatNumber(threads.length), real_value: threads.length },
	];

	const loaders = [
		{ label: "profile", data: profileL },
		{ label: "insights", data: insightsL },
		{ label: "demographics", data: followerDemographicsL },
		{ label: "threads", data: threadsL },
	];

	const [currentTab, setCurrentTab] = useState<React.ReactNode>(null);

	// const clear = useCacheStore((state) => state.clearCache);

	const [setOpenModal] = useModalStore((state) => [state.setOpen]);

	const items = useMemo(() => {
		return [
			{
				label: "daily 📋",
				comp: () => <DailyReportView />,
			},
			{
				label: "charts 📈",
				comp: () => <UserInsightsChartView />,
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
		<div className="font-rounded ">
			<div className="flex items-center justify-center py-3 px-5 text-black font-rounded font-bold text-xs ">
				<div className=" flex flex-col justify-center items-center backdrop-blur-2xl bg-white bg-opacity-50 rounded-xl py-4 px-5 border-4 border-white">
					<div className="flex items-center justify-center  text-black font-rounded font-bold text-2xl mb-2">
						<img className="h-7 w-7" src="./unthreadme-logo.svg" alt="" />
						<span className="ml-2">unthread.me</span>
					</div>
					<span className="text-gray-900 font-regular">🔒 private threads insights</span>
				</div>
			</div>

			<div className="rounded-2xl backdrop-blur-2xl bg-white bg-opacity-50">
				<h2 className="sr-only" id="profile-overview-title">
					Profile Overview
				</h2>
				<div className="p-6 ">
					<div className="sm:flex sm:items-center sm:justify-between">
						<div className=" flex justify-around sm:mt-0">
							<button
								onClick={refresh}
								className="flex flex-col items-center justify-center rounded-xl bg-white px-6 py-5 text-sm font-semibold text-gray-900 shadow-md border-4 hover:scale-110 hover:shadow-xl transform transition duration-200 ease-in-out"
							>
								<div className="sm:flex sm:space-x-5 ">
									<div className="flex-shrink-0">
										<img
											className="mx-auto h-20 w-20 rounded-xl"
											src={profile?.data?.threads_profile_picture_url}
											alt=""
										/>
									</div>
									<div className="text-center sm:text-left my-2 max-w-72">
										<p className="truncate text-3xl font-bold font-rounded text-gray-900  ">
											@{profile?.data?.username}
										</p>
										<p className="mt-3 text-lg">🔄 cache</p>
									</div>
								</div>

								<div className="    rounded-md  text-xs w-full mt-2 grid grid-cols-2 gap-2">
									{loaders.map((stat) => (
										<div key={stat.label} className="ml-3 flex text-xs">
											{stat.data?.is_loading ? <Loader /> : "✅"} {stat.label}
										</div>
									))}
								</div>
							</button>
						</div>
					</div>
				</div>

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
