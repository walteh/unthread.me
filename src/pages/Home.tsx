import { FC } from "react";

import useStore from "../threadsapi/store";

import { getAuthorizationStartURL } from "../threadsapi/api";
import useUserProfile from "@src/hooks/useUserProfile";
import useUserInsights from "@src/hooks/useUserInsights";

const Home: FC = () => {
	const [token] = useStore((state) => [state.access_token] as const);
	const [is_logging_in] = useStore((state) => [state.is_logging_in] as const);

	const [userProfile] = useUserProfile();

	const [insights, , insights_error] = useUserInsights();

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
							<p className="py-5">id: {token.user_id} </p>
							<p className="py-5">username: {userProfile?.username} </p>
							<p className="py-5">bio: {userProfile?.threads_biography} </p>

							{insights && (
								<>
									{insights.data.map((insight) => (
										<p key={insight.id}>
											{insight.name}: {insight.total_value?.value ?? 0}
										</p>
									))}
								</>
							)}

							{insights_error && <p>{insights_error}</p>}
							<button className="btn-primary btn">Get Started</button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Home;
