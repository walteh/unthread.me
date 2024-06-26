import { FC } from "react";

import useStore from "../threadsapi/store";

import { getAuthorizationStartURL } from "@src/threadsapi/api";
import useUserProfile from "@src/hooks/useUserProfile";
import useAccessTokenExpiresIn from "@src/hooks/useAccessTokenExpiresIn";
import UserInsightsViews from "@src/components/UserInsightsViews";

const Home: FC = () => {
	const [token] = useStore((state) => [state.access_token] as const);
	const [is_logging_in] = useStore((state) => [state.is_logging_in] as const);

	const [userProfile] = useUserProfile();
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
		<>
			<section>
				<div className="hero min-h-[calc(100vh-64px)] bg-base-200">
					<div className="hero-content flex-col lg:flex-row">
						<div>
							<h1 className="text-5xl font-bold">Welcome</h1>
							<p className="py-5">id: {token.user_id} </p>
							<p className="py-5">username: {userProfile?.username} </p>
							<p className="py-5">bio: {userProfile?.threads_biography} </p>

							<UserInsightsViews />
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Home;
