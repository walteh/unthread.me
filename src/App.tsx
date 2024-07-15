import { FC } from "react";
import { IoLogoGithub } from "react-icons/io5";
import { Navigate, Route, Routes } from "react-router-dom";

import useAccessTokenUpdater from "./client/hooks/useAccessTokenUpdater";
import { useInitialThreadsAPIUserDataUpdater, useInitialThreadsLoader } from "./client/hooks/useCacheStoreUpdaters";
import useFeatureFlagUpdater from "./client/hooks/useFeatureFlagUpdater";
import Home from "./components/Home";
import threadsapi from "./threadsapi";

const App: FC = () => {
	useFeatureFlagUpdater();
	useAccessTokenUpdater();
	// useBackgroundUpdater();
	useInitialThreadsAPIUserDataUpdater("user_profile", threadsapi.get_user_profile);
	useInitialThreadsLoader();
	useInitialThreadsAPIUserDataUpdater("user_insights", threadsapi.get_user_insights);
	useInitialThreadsAPIUserDataUpdater("user_follower_demographics", threadsapi.get_follower_demographics);
	// useInitialThreadsAPIMediaDataUpdater("user_threads_replies", threadsapi.get_conversation);
	// useInitialThreadsAPIMediaDataUpdater("user_threads_insights", threadsapi.get_media_insights);
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}></Route>
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</>
	);
};

const Layout: FC = () => {
	return (
		<div className="min-h-screen">
			<div className="flex items-center justify-center py-3 px-5 text-black font-rounded font-bold text-xs">
				<div className="relative flex flex-col justify-center items-center backdrop-blur-2xl bg-white bg-opacity-50 rounded-xl py-4 px-5  border-white m-5">
					<div className="flex items-center justify-center  text-black font-rounded font-bold text-2xl mb-2">
						<img className="h-7 w-7" src="./unthreadme-logo.svg" alt="" />
						<span className="ml-2">unthread.me</span>
					</div>
					<span className="text-gray-900 font-regular">🔒 private threads insights</span>
					<button
						onClick={() => {
							window.open("https://threads.net/@walt_eh", "_blank");
						}}
						style={{ fontSize: "0.6rem" }}
						className="absolute shadow-sm inline-flex items-center gap-x-1.5 rounded-full bg-black px-2 py-1 text-xs font-medium text-white font-mono -bottom-3 -right-3 hover:scale-115 transform transition duration-200 ease-in-out backdrop-blur-xl bg-opacity-90"
					>
						by <img width={10} className="-mr-1" src="./threads-logo-white.svg"></img> walt_eh
					</button>
				</div>
			</div>

			<Home />
			<div className="flex justify-center items-center ">
				<div className="grid gap-4 grid-cols-3 p-5">
					<button
						onClick={() => {
							open("https://github.com/walteh/unthread.me/blob/main/docs/terms-of-service.md", "_blank");
						}}
						className="flex items-center justify-center  bg-white text-black text-sm px-3 py-2 rounded-xl shadow-xl transition duration-300 transform hover:scale-105 backgdrop-blur-lg bg-opacity-50"
					>
						terms of service
					</button>
					<button
						onClick={() => {
							open("https://github.com/walteh/unthread.me/blob/main/docs/privacy-policy.md", "_blank");
						}}
						className="flex items-center justify-center bg-white text-black text-sm px-3 py-2 rounded-xl shadow-xl transition duration-300 transform hover:scale-105 backgdrop-blur-lg bg-opacity-50"
					>
						privacy policy
					</button>
					<button
						onClick={() => {
							open("https://github.com/walteh/unthread.me", "_blank");
						}}
						className="flex items-center justify-center  bg-white text-black text-sm px-3 py-2 rounded-xl shadow-xl transition duration-300 transform hover:scale-105 backgdrop-blur-lg bg-opacity-50"
					>
						<IoLogoGithub className="mr-1" />
						source code
					</button>
				</div>
			</div>
		</div>
	);
};

export default App;
