import { FC } from "react";

import { useIsLoggedIn } from "@src/client/hooks/useIsLoggedIn";
import useSessionStore from "@src/client/hooks/useSessionStore";
import UserProfile2 from "@src/components/UserProfile2";
import threadsapi from "@src/threadsapi";

// function classNames(...classes: (string | boolean | undefined)[]) {
// 	return classes.filter(Boolean).join(" ");
// }

const Home: FC = () => {
	const [is_logging_in] = useSessionStore((state) => [state.is_logging_in] as const);

	const [isLoggedIn, , time] = useIsLoggedIn();

	console.log("expiration time", new Date(time ?? 0).toLocaleString());

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
			{/* <Status /> */}
			<div
				style={{
					minHeight: "calc(100vh - 64px)",
					// padding: "2rem 0",
				}}
			>
				<div style={{ maxWidth: "1000px" }} className="mx-auto p-4">
					<UserProfile2 />

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
