import { FC } from "react";

import useStore from "../threadsapi/store";

import { getAuthorizationStartURL } from "../threadsapi/api";

const Home: FC = () => {
	const [token] = useStore((state) => [state.access_token] as const);

	if (token === null) {
		return (
			<>
				<section>
					<button
						onClick={() => {
							const authUrl = getAuthorizationStartURL();
							// open new tab
							window.open(authUrl.toString(), "_blank");
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
						<img src="/images/hero.webp" className="max-w-sm rounded-lg shadow-2xl" />
						<div>
							<h1 className="text-5xl font-bold">Welcome</h1>
							<p className="py-5">
								Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia minima laboriosam maxime sed dignissimos
								harum provident itaque fugiat. A repellat aliquid inventore dolor tempora, omnis perferendis aspernatur quo
								nisi excepturi. Ex, ullam odio iusto esse necessitatibus doloremque repudiandae!
								{token.user_id}
							</p>
							<button className="btn-primary btn">Get Started</button>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default Home;
