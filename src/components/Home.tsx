import { FC } from "react";

import useFeatureFlagStore from "@src/client/hooks/useFeatureFlagStrore";
import { useIsLoggedIn } from "@src/client/hooks/useIsLoggedIn";
import useSessionStore from "@src/client/hooks/useSessionStore";
import UserProfile2 from "@src/components/UserProfile2";
import threadsapi from "@src/threadsapi";

const Home: FC = () => {
	const [is_logging_in] = useSessionStore((state) => [state.is_logging_in] as const);

	const [is_an_idiot] = useFeatureFlagStore((state) => [state.enable_alpha_i_know_what_im_doing] as const);

	const [isLoggedIn, ,] = useIsLoggedIn();
	if (is_logging_in) {
		return (
			<div className="flex items-center justify-center flex-col ">
				<div className="flex flex-col items-center m-10">
					<span className="text-xl font-extrabold text-gray-900 tracking-wide  font-rounded">logging you in...</span>
				</div>
			</div>
		);
	}

	if (!is_an_idiot) {
		return (
			<div className="flex items-center justify-center flex-col">
				<div className="flex flex-col items-center m-10 mt-0 w-96 text-center  dark:text-gray-100 text-gray-900">
					<span className="text-3xl font-extrabold  tracking-wide  font-rounded">🧱</span>
					<span className="text-xl font-extrabold  tracking-wide  font-rounded mb-5">under construction</span>
					<span className="text-md  tracking-wide font-rounded  prose-p text-center mb-5">
						unthread.me lets you access your threads api data in a <strong>free</strong> and <strong>secure</strong> way
					</span>
					<span className="text-md  tracking-wide font-rounded  prose-p text-center mb-5">
						all of your data is stored in your browser and <strong>never</strong> leaves your device
					</span>
					<span className="text-md  tracking-wide font-rounded  prose-p text-center mb-5">
						your threads login token is passed through a secure oauth flow and <strong>never</strong> stored or logged on our
						servers
					</span>
					<span className="text-md  tracking-wide font-rounded">
						subscribe to my newsletter and be the first to know when its ready! ⬇️
					</span>
				</div>

				<div className="text-center ">
					<iframe
						src="https://www.walteh.com/embed"
						// width="400"
						height="320"
						// style="border:1px solid #EEE; background:white;"
						style={{}}
						className="rounded-2xl shadow-lg w-96 "
						// frameBorder="0"
						// scrolling="no"
					></iframe>
				</div>
			</div>
		);
	}

	if (!isLoggedIn) {
		return (
			<div className="flex items-center justify-center flex-col ">
				<div className="flex flex-col items-center m-10 w-96">
					<span className="text-xl font-extrabold text-gray-900 tracking-wide  font-rounded mb-5">welcome!</span>
					<span className="text-md text-gray-900 tracking-wide font-rounded  prose-p text-center mb-5">
						unthread.me lets you access you threads api data in a free and secure way
					</span>
					<span className="text-md text-gray-900 tracking-wide font-rounded  prose-p text-center mb-5">
						all of your data is stored in your browser and never leaves your device
					</span>
					<span className="text-md text-gray-900 tracking-wide font-rounded  prose-p text-center mb-5">
						your threads login token is passed through a secure oauth flow and never stored or logged on our servers
					</span>
				</div>

				<button
					onClick={() => {
						const authUrl = threadsapi.generate_auth_start_url();
						window.location.href = authUrl.toString();
					}}
					className="flex items-center bg-black text-white px-3 py-2 rounded-xl shadow-lg hover:bg-gray-800 transition duration-300 transform hover:scale-105"
				>
					login with
					<img className="ml-2" width="20" src="./threads-logo-white.svg" alt="Threads Logo" />
				</button>
			</div>
		);
	}

	return <UserProfile2 />;
};

export default Home;
