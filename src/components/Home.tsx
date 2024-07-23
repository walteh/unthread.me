import { FC, useState } from "react";

// corrected 'useFeatureFlagStrore'
import { useIsLoggedIn } from "@src/client/hooks/useIsLoggedIn";
import useModalStore from "@src/client/hooks/useModalStore";
import useSessionStore from "@src/client/hooks/useSessionStore";
import UserProfile2 from "@src/components/UserProfile2";
import threadsapi from "@src/threadsapi";

import Modal from "./Modal";

const Home: FC = () => {
	const [is_logging_in] = useSessionStore((state) => [state.is_logging_in] as const);

	// const [is_alpha_user] = useFeatureFlagStore((state) => [state.enable_alpha_i_know_what_im_doing] as const);

	const [checked, setChecked] = useState<boolean>(false);

	const [checked2, setChecked2] = useState<boolean>(false);

	const open = useModalStore((state) => state.setOpen);

	const [isLoggedIn, ,] = useIsLoggedIn();
	if (is_logging_in) {
		return (
			<div className="flex items-center justify-center flex-col ">
				<div className="flex flex-col items-center m-10">
					<span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-wide  font-rounded">
						logging you in...
					</span>
				</div>
			</div>
		);
	}

	// if (!is_alpha_user) {
	// 	return (
	// 		<div className="flex items-center justify-center flex-col">
	// 			<div className="flex flex-col items-center m-10 mt-0 w-80 text-center  dark:text-gray-100 text-gray-900">
	// 				<span className="text-3xl font-extrabold  tracking-wide  font-rounded">🧱</span>
	// 				<span className="text-xl font-extrabold  tracking-wide  font-rounded mb-5">under construction</span>
	// 				<span className="text-md  tracking-wide font-rounded  prose-p text-center mb-5">
	// 					unthread.me lets you access your threads api data in a <strong>free</strong> and <strong>secure</strong> way
	// 				</span>
	// 				<span className="text-md  tracking-wide font-rounded  prose-p text-center mb-5">
	// 					all of your data is stored in your browser and <strong>never</strong> leaves your device
	// 				</span>
	// 				<span className="text-md  tracking-wide font-rounded  prose-p text-center mb-5">
	// 					your threads login token is passed through a secure oauth flow hosted at <code> api.unthread.me</code> and{" "}
	// 					<strong>never</strong> stored or logged
	// 				</span>
	// 				<span className="text-md tracking-wide font-rounded  prose-p text-center mb-5">
	// 					once your token is created, your browser interacts with the <strong>threads api directly</strong> at
	// 					<code> graph.threads.net</code>
	// 				</span>
	// 				<span className="text-md tracking-wide font-rounded  prose-p text-center mb-5">
	// 					you only ever have <strong>READ</strong> access to your threads data
	// 				</span>
	// 				<span className="text-md  tracking-wide font-rounded">
	// 					subscribe to my newsletter and be the first to know when its ready! ⬇️
	// 				</span>
	// 			</div>

	// 			<div className="text-center ">
	// 				<iframe src="https://www.walteh.com/embed" height="320" style={{}} className="rounded-2xl shadow-lg w-96 "></iframe>
	// 			</div>
	// 		</div>
	// 	);
	// }

	if (!isLoggedIn) {
		return (
			<div className="flex items-center justify-center flex-col ">
				<div className="flex flex-col items-center m-5  w-80 dark:text-gray-100 text-gray-900">
					<span className="text-xl font-extrabold  tracking-wide  font-rounded mb-5">welcome!</span>
					<span className="text-md  tracking-wide font-rounded  prose-p text-center mb-5">
						<code>unthread.me</code> lets you access your threads api data in a <strong>free</strong> and{" "}
						<strong>secure</strong> way
					</span>
					<span className="text-md  tracking-wide font-rounded  prose-p text-center mb-5">
						all of your data is stored in your browser and <strong>never</strong> leaves your device
					</span>
					<span className="text-md  tracking-wide font-rounded  prose-p text-center mb-5">
						your threads login token is passed through a secure oauth flow hosted at <code> api.unthread.me</code> and{" "}
						<strong>never</strong> stored or logged
					</span>

					<span className="text-md  tracking-wide font-rounded  prose-p text-center mb-5">
						once your token is created, your browser interacts with the <strong>threads api directly</strong> at
						<code> graph.threads.net</code>
					</span>
					<span className="text-md  tracking-wide font-rounded  prose-p text-center mb-5">
						you only ever have <strong>READ</strong> access to your threads data
					</span>
				</div>

				<div className="mb-5 text-xs">
					<label className="flex items-center space-x-3 w-80  text-center">
						<input
							type="checkbox"
							checked={checked}
							onChange={(e) => {
								setChecked(e.target.checked);
							}}
						/>
						<span className="text-gray-900 dark:text-gray-100">
							I understand this app has not yet gone through the meta approval process, I am an alpha tester, and have read
							everything on this page
						</span>
					</label>
				</div>

				<div className="mb-5 flex flex-col text-xs">
					<label className="flex items-center space-x-3 w-80">
						<input
							type="checkbox"
							checked={checked2}
							onChange={(e) => {
								setChecked2(e.target.checked);
							}}
						/>
						<span className="text-gray-900 dark:text-gray-100 text-center">
							I have accepted the invite inside threads
							<button
								className="inline text-xs items-center underline text-blue-500 px-2 py-1 "
								onClick={() => {
									open(true);
								}}
							>
								click here to see how
							</button>
						</span>
					</label>
				</div>

				<button
					onClick={() => {
						const authUrl = threadsapi.generate_auth_start_url();
						window.open(authUrl.toString(), "_system");
					}}
					disabled={!checked || !checked2}
					className="flex items-center bg-black text-white px-3 py-2 rounded-xl shadow-lg hover:bg-gray-800 transition duration-300 transform hover:scale-105 disabled:bg-gray-600 mb-10"
				>
					login with
					<img className="ml-2" width="20" src="./threads-logo-white.svg" alt="Threads Logo" />
				</button>

				<Modal>
					<div className="flex justify-center items-center h-full flex-col text-center dark:text-white">
						<p>inside threads, go here and click {'"Accept"'}</p>
						<p className="mb-5">
							<button
								className="mt-5 bg-black text-white px-3 py-2 rounded-xl shadow-lg hover:bg-gray-800 transition duration-300 transform hover:scale-105"
								onClick={() => {
									window.open("https://www.threads.net/settings/account", "_system");
								}}
							>
								{" "}
								<code>{"threads.net > Settings > Account > Website Permissions > Invites"}</code>
							</button>
						</p>

						<p className="mb-5">when you are done, you should see something that looks like this:</p>

						<img width={300} src="./invites.png"></img>
						<p className="my-5">
							note: this is only possible from a browser, but you can open it by clicking on {'"Website permissions"'} in the
							app
						</p>

						<button
							onClick={() => {
								open(false);
							}}
							className="mt-5 bg-black text-white px-3 py-2 rounded-2xl shadow-2xl"
						>
							⬅️ go back
						</button>
					</div>
				</Modal>
			</div>
		);
	}

	return <UserProfile2 />;
};

export default Home;
