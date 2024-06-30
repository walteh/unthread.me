import { FC, useMemo, useState } from "react";

import { useIsLoggedIn } from "@src/client/hooks/useIsLoggedIn";
import useSessionStore from "@src/client/hooks/useSessionStore";
import useTimePeriod from "@src/client/hooks/useTimePeriod";
import UserInsightsChartView from "@src/components/UserInsightsChartView";
import UserProfileView from "@src/components/UserProfileView";
import WordSegmentLineChart from "@src/components/WordSegmentLineChart";
import threadsapi from "@src/threadsapi";

function classNames(...classes: (string | boolean | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}

const Home: FC = () => {
	const [is_logging_in] = useSessionStore((state) => [state.is_logging_in] as const);

	const [isLoggedIn, , time] = useIsLoggedIn();

	console.log("expiration time", new Date(time ?? 0).toLocaleString());

	const [timePeriod, timePeriods, handleTimePeriodChange] = useTimePeriod();

	const [currentTab, setCurrentTab] = useState("Views Chart");

	const items = useMemo(() => {
		return [
			{
				label: "Daily Reports",
				comp: () => <div>Daily Reports</div>,
			},
			{
				label: "Views Chart",
				comp: () => <UserInsightsChartView />,
			},

			{
				label: "Word Frequency",
				comp: () => <WordSegmentLineChart />,
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
			<div
				style={{
					minHeight: "calc(100vh - 64px)",
					padding: "2rem 0",
				}}
			>
				<div style={{ maxWidth: "1000px" }} className="mx-auto p-4">
					<UserProfileView />

					{/* <button
						onClick={() => {
							void refresh();
						}}
					>
						refresh
					</button> */}
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							marginTop: "1rem",
						}}
					>
						<label htmlFor="timePeriod" className="mr-2">
							Select Time Period:
						</label>
						<select id="timePeriod" value={timePeriod.label} onChange={handleTimePeriodChange} className="p-2 border rounded">
							{Object.entries(timePeriods).map(([, tp]) => (
								<option key={tp.label} value={tp.label}>
									{!tp.label.includes("days")
										? tp.label
										: `Last ${tp.label.replace("days", "").replace("last", "")} Days`}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-row justify-around mt-5 mb-5">
						<div className="sm:hidden">
							<label htmlFor="tabs" className="sr-only">
								Select a tab
							</label>
							{/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
							<select
								id="tabs"
								name="tabs"
								className="block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 p-3"
								defaultValue={items.find((tab) => tab.label === currentTab)?.label}
							>
								{items.map((tab) => (
									<option
										onClick={() => {
											setCurrentTab(tab.label);
										}}
										key={tab.label}
									>
										{tab.label}
									</option>
								))}
							</select>
						</div>
						<div className="hidden sm:block">
							<nav className="flex space-x-4" aria-label="Tabs">
								{items.map((tab) => (
									<a
										key={tab.label}
										onClick={() => {
											setCurrentTab(tab.label);
										}}
										// href={tab.href}
										className={classNames(
											tab.label === currentTab ? "bg-gray-100 text-gray-700" : "text-gray-500 hover:text-gray-700",
											"rounded-md px-3 py-2 text-lg font-medium shadow-lg",
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
							<item.comp />
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
