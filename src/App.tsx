import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "@src/pages/Home";

import useAccessTokenUpdater from "./client/hooks/useAccessTokenUpdater";
import useBackgroundUpdater from "./client/hooks/useBackgroundUpdater";
import {
	useThreadsAPIExirationUpdater,
	useThreadsAPIMediaDataUpdater,
	useThreadsAPIUserDataUpdater,
} from "./client/hooks/useCacheStoreUpdaters";
import threadsapi from "./threadsapi";

const App: FC = () => {
	useAccessTokenUpdater();
	useBackgroundUpdater();
	useThreadsAPIUserDataUpdater("user_profile", threadsapi.get_user_profile);
	useThreadsAPIUserDataUpdater("user_threads", threadsapi.get_user_threads);
	useThreadsAPIUserDataUpdater("user_insights", threadsapi.get_user_insights);
	useThreadsAPIUserDataUpdater("user_follower_demographics", threadsapi.get_follower_demographics);
	useThreadsAPIMediaDataUpdater("user_threads_replies", threadsapi.get_conversation);
	useThreadsAPIMediaDataUpdater("user_threads_insights", threadsapi.get_media_insights);
	useThreadsAPIExirationUpdater();
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
		<div className="h-screen overflow-x-hidden">
			<Home />
		</div>
	);
};

export default App;
