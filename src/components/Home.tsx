import { FC } from "react";

import { useIsLoggedIn } from "@src/client/hooks/useIsLoggedIn";
import useSessionStore from "@src/client/hooks/useSessionStore";
import UserProfile2 from "@src/components/UserProfile2";
import threadsapi from "@src/threadsapi";

const Home: FC = () => {
	const [is_logging_in] = useSessionStore((state) => [state.is_logging_in] as const);

	const [isLoggedIn, ,] = useIsLoggedIn();

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

	return <UserProfile2 />;
};

export default Home;
