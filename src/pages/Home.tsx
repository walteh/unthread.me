import { FC, useMemo, useState } from "react";

import { useIsLoggedIn } from "@src/client/hooks/useIsLoggedIn";
import useSessionStore from "@src/client/hooks/useSessionStore";
import DailyReportView from "@src/components/DailyReportView";
import Status from "@src/components/Status";
import UserInsightsChartView from "@src/components/UserInsightsChartView";
import UserProfile2 from "@src/components/UserProfile2";
import UserThreadsView from "@src/components/UserThreadsView";
import WordSegmentLineChart from "@src/components/WordSegmentLineChart";
import threadsapi from "@src/threadsapi";

function classNames(...classes: (string | boolean | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}

const Home: FC = () => {
	const [is_logging_in] = useSessionStore((state) => [state.is_logging_in] as const);

	const [isLoggedIn, , time] = useIsLoggedIn();

	console.log("expiration time", new Date(time ?? 0).toLocaleString());

	const [currentTab, setCurrentTab] = useState("Views Chart");

	// const clear = useCacheStore((state) => state.clearCache);

	const items = useMemo(() => {
		return [
			{
				label: "Daily Reports",
				comp: () => <DailyReportView />,
			},
			{
				label: "Views Chart",
				comp: () => <UserInsightsChartView />,
			},

			{
				label: "Word Frequency",
				comp: () => <WordSegmentLineChart />,
			},

			{
				label: "Post Search",
				comp: () => <UserThreadsView />,
			},
		];
	}, []);

	if (is_logging_in) {
		return (
			<>
				<section>
					<div className="hero min-h-[calc(100vh-64px)] bg-base-200">
						<div className="hero-content flex-col lg:flex-row">
							<div>
								<h1 className="text-5xl font-bold">Logging in...</h1>
							</div>
						</div>
					</div>
				</section>
			</>
		);
	}

	if (!isLoggedIn) {
		return (
			<>
				<section>
					<button
						onClick={() => {
							const authUrl = threadsapi.generate_auth_start_url();
							// redirect to the auth URL
							window.location.href = authUrl.toString();
						}}
						className="btn-primary btn"
					>
						Login with
					</button>
				</section>
			</>
		);
	}

	return (
		<section>
			<Status />
			<div
				style={{
					minHeight: "calc(100vh - 64px)",
					padding: "2rem 0",
				}}
			>
				<div style={{ maxWidth: "1000px" }} className="mx-auto p-4">
					<UserProfile2 />

					{/* <button
						onClick={clear}
						className="relative inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white shadow-lg transition-transform transform hover:scale-110 focus:outline-none"
					>
						<svg
							className="w-6 h-6 animate-spin"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 4v5h.582m.92-3.667A9 9 0 1112 21v-1M3 3l3 3"
							></path>
						</svg>
					</button> */}

					<div className="flex flex-row justify-around mt-5 mb-5">
						<div className="sm:hidden">
							<label htmlFor="tabs" className="sr-only">
								Select a tab
							</label>
							{/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
							<select
								id="tabs"
								name="tabs"
								onChange={(e) => {
									setCurrentTab(e.target.value);
								}}
								className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-3"
								defaultValue={items.find((tab) => tab.label === currentTab)?.label}
							>
								{items.map((tab) => (
									<option
										onClick={() => {
											setCurrentTab(tab.label);
										}}
										key={tab.label}
										className="font-medium text-lg text-gray-700 hover:text-gray-800"
									>
										{tab.label}
									</option>
								))}
							</select>
						</div>

						<div className="hidden sm:block text-center  text-nowrap">
							<nav className="flex flex-wrap space-x-4 justify-center rounded-lg p-4" aria-label="Tabs">
								{items.map((tab) => (
									<a
										key={tab.label}
										onClick={() => {
											setCurrentTab(tab.label);
										}}
										// href={tab.href}
										className={classNames(
											tab.label === currentTab
												? "bg-blue-600 text-white shadow-xl "
												: "text-gray-500 hover:text-gray-500 bg-gray-100 shadow-sm",
											"rounded-md px-3 py-2 text-lg font-medium mt-1 mb-1 justify-self-center font-rounded",
										)}
										aria-current={tab.label === currentTab ? "page" : undefined}
									>
										{tab.label}
									</a>
								))}
							</nav>
						</div>
					</div>

					{items.map((item) => (
						<div key={item.label} className={classNames(item.label === currentTab ? "block" : "hidden")}>
							{item.label === currentTab ? <item.comp /> : null}
						</div>
					))}

					{/* <UserInsightsChartView /> */}
				</div>
			</div>
		</section>
	);
};

export default Home;

// <div className="w-full lg:w-auto  mx-auto">
// <div className="flex flex-row justify-around items-center">
// 	<h1 className="bg-gradient-to-l from-primary-content via-secondary to-primary bg-clip-text text-3xl font-bold text-transparent">
// 		unthread.me
// 	</h1>
// 	<div className="grid grid-flow-col gap-5 text-center auto-cols-max ">
// 		<div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content ">
// 			<span className="countdown font-mono text-l">
// 				{/* @ts-expect-error - --value is a cusotm type of daisyui */}
// 				<span style={{ "--value": Math.floor(access_token_expires_in / 1000 / 60) }}></span>
// 			</span>
// 			<span className="text-s">min</span>
// 		</div>
// 		<div>
// 			<div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
// 				<span className="countdown font-mono text-l">
// 					{/* @ts-expect-error - --value is a cusotm type of daisyui */}
// 					<span style={{ "--value": Math.floor(access_token_expires_in / 1000) % 60 }}></span>
// 				</span>
// 				sec
// 			</div>
// 		</div>
// 	</div>
// </div>
// </div>
