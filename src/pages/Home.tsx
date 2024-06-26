import { FC } from "react";

import useStore from "../threadsapi/store";

import { getAuthorizationStartURL } from "../threadsapi/api";
import useUserProfile from "@src/hooks/useUserProfile";

const Home: FC = () => {
	const [token] = useStore((state) => [state.access_token] as const);
	const [is_logging_in] = useStore((state) => [state.is_logging_in] as const);

	const [userProfile] = useUserProfile();

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

	if (token === null) {
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
		<>
			<section>
				<div className="hero min-h-[calc(100vh-64px)] bg-base-200">
					<div className="hero-content flex-col lg:flex-row">
						<div>
							<h1 className="text-5xl font-bold">Welcome</h1>
							<p className="py-5">logged in as {token.user_id} </p>
							<p className="py-5">logged in as {userProfile?.username} </p>
							<p className="py-5">logged in as {userProfile?.threads_biography} </p>
							<button className="btn-primary btn">Get Started</button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Home;
