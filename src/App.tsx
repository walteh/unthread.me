import { FC } from "react";
import { IoLogoGithub } from "react-icons/io5";
import { Navigate, Route, Routes } from "react-router-dom";

import useAccessTokenUpdater from "./client/hooks/useAccessTokenUpdater";
import useFeatureFlagUpdater from "./client/hooks/useFeatureFlagUpdater";
import Home from "./components/Home";
import ThreadsButton from "./components/ThreadsButton";

const App: FC = () => {
	useFeatureFlagUpdater();
	useAccessTokenUpdater();
	// useBackgroundUpdater();

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
			<div className="flex items-center justify-center py-3 px-5 text-gray-950 font-rounded font-bold text-xs">
				<div className="relative flex flex-col justify-center items-center backdrop-blur-2xl bg-white bg-opacity-70 rounded-xl py-4 px-5  border-white m-5">
					<div className="flex items-center justify-center  font-rounded font-bold text-2xl mb-2">
						<img className="h-9 w-9 shadow-2xl -mr-2" src="./unthreadme-logo-2.svg" alt="" />
						<span className="ml-2">unthread.me</span>
					</div>
					<span className="text-gray-800 font-regular">🔒 private threads insights</span>
					<ThreadsButton username="walt_eh" prefix="by" className="absolute -bottom-3 -right-3" />
				</div>
			</div>

			<Home />
			<div className="flex justify-center items-center ">
				<div className="grid gap-4 sm:grid-cols-3 p-5">
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
