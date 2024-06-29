import { FC } from "react";

import UserInsightsChartView from "@src/components/UserInsightsChartView";
import UserProfileView from "@src/components/UserProfileView";
import WordSegmentLineChart from "@src/components/WordSegmentLineChart";
import useTimePeriod from "@src/hooks/useTimePeriod";
import { getAuthorizationStartURL } from "@src/threadsapi/api";

import { useInMemoryStore, useIsLoggedIn } from "../threadsapi/store";

const Home: FC = () => {
	const [is_logging_in] = useInMemoryStore((state) => [state.is_logging_in] as const);

	const [isLoggedIn, , time] = useIsLoggedIn();

	console.log("expiration time", new Date(time ?? 0).toLocaleString());

	const [timePeriod, timePeriods, handleTimePeriodChange] = useTimePeriod();

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
							const authUrl = getAuthorizationStartURL();
							// redirect to the auth URL
							window.location.href = authUrl.toString();
						}}
						className="btn-primary btn"
					>
						Login
					</button>
				</section>
			</>
		);
	}

	return (
		<section>
			<div className=" bg-base-200">
				<div className="flex-col lg:flex-col items-start ">
					<UserProfileView />
					<div className="mb-4">
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
					<UserInsightsChartView />
					{/* <UserThreadsView /> */}
					<WordSegmentLineChart />
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
