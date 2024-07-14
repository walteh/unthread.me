import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import useAccessTokenUpdater from "./client/hooks/useAccessTokenUpdater";
import useBackgroundUpdater from "./client/hooks/useBackgroundUpdater";
import { useInitialThreadsAPIUserDataUpdater, useInitialThreadsLoader } from "./client/hooks/useCacheStoreUpdaters";
import Home from "./components/Home";
import threadsapi from "./threadsapi";

const App: FC = () => {
	useAccessTokenUpdater();
	useBackgroundUpdater();
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
		<div className="h-screen">
			<Home />
		</div>
	);
};

export default App;
