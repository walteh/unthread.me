import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "@src/pages/Home";

import useAccessTokenUpdater from "./hooks/useAccessTokenUpdater";
import { useThreadsAPIExirationUpdater, useThreadsAPIMediaDataUpdater, useThreadsAPIUserDataUpdater } from "./hooks/useThreadsAPI";
import {
	getAllUserInsightsWithDefaultParams,
	getDefaultConversation,
	getFollowerDemographicsInsights,
	getMediaInsightsWithDefaultParams,
	getUserProfile,
	getUserThreads,
} from "./threadsapi/api";

const App: FC = () => {
	useAccessTokenUpdater();
	useThreadsAPIUserDataUpdater("user_profile", getUserProfile);
	useThreadsAPIUserDataUpdater("user_threads", getUserThreads);
	useThreadsAPIUserDataUpdater("user_insights", getAllUserInsightsWithDefaultParams);
	useThreadsAPIUserDataUpdater("user_follower_demographics", getFollowerDemographicsInsights);
	useThreadsAPIMediaDataUpdater("user_threads_replies", getDefaultConversation);
	useThreadsAPIMediaDataUpdater("user_threads_insights", getMediaInsightsWithDefaultParams);
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
