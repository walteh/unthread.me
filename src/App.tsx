import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "@src/pages/Home";

import useAccessTokenUpdater from "./hooks/useAccessTokenUpdater";
import {
	getAllUserInsightsWithDefaultParams,
	getDefaultConversation,
	getFollowerDemographicsInsights,
	getMediaInsightsWithDefaultParams,
	getUserProfile,
	getUserThreads,
} from "./threadsapi/api";
import { useDataFetcher, useNestedDataFetcher } from "./threadsapi/store";

const App: FC = () => {
	useAccessTokenUpdater();
	useDataFetcher("user_profile", getUserProfile);
	useDataFetcher("user_threads", getUserThreads);
	useDataFetcher("user_insights", getAllUserInsightsWithDefaultParams);
	useDataFetcher("user_follower_demographics", getFollowerDemographicsInsights);
	useNestedDataFetcher("user_threads_replies", getDefaultConversation);
	useNestedDataFetcher("user_threads_insights", getMediaInsightsWithDefaultParams);
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
