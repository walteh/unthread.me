import { FC } from "react";

import UserInsightsViews from "@src/components/UserInsightsViews";
import UserProfileView from "@src/components/UserProfileView";
import UserThreadsView from "@src/components/UserThreadsView";
import useAccessTokenExpiresIn from "@src/hooks/useAccessTokenExpiresIn";
import { getAuthorizationStartURL } from "@src/threadsapi/api";

import { useInMemoryStore, usePersistantStore } from "../threadsapi/store";

const Home: FC = () => {
	const [token] = usePersistantStore((state) => [state.access_token] as const);
	const [is_logging_in] = useInMemoryStore((state) => [state.is_logging_in] as const);

	const access_token_expires_in = useAccessTokenExpiresIn();

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

	if (token === null || access_token_expires_in <= 0) {
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
			<div className="hero bg-base-200">
				<div className="flex-col lg:flex-row items-start">
					<div className="w-full lg:w-auto  mx-auto">
						<div className="flex flex-row justify-around items-center">
							<h1 className="bg-gradient-to-l from-primary-content via-secondary to-primary bg-clip-text text-3xl font-bold text-transparent">
								unthread.me
							</h1>
							<div className="grid grid-flow-col gap-5 text-center auto-cols-max ">
								<div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content ">
									<span className="countdown font-mono text-l">
										{/* @ts-expect-error - --value is a cusotm type of daisyui */}
										<span style={{ "--value": Math.floor(access_token_expires_in / 1000 / 60) }}></span>
									</span>
									<span className="text-s">min</span>
								</div>
								<div>
									<div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
										<span className="countdown font-mono text-l">
											{/* @ts-expect-error - --value is a cusotm type of daisyui */}
											<span style={{ "--value": Math.floor(access_token_expires_in / 1000) % 60 }}></span>
										</span>
										sec
									</div>
								</div>
							</div>
						</div>
					</div>
					<UserProfileView />
					<UserInsightsViews />
					<UserThreadsView />
				</div>
			</div>
		</section>
	);
};

export default Home;
