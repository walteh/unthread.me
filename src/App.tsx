import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "@src/pages/Home";

import useAccessTokenUpdater from "./hooks/useAccessTokenUpdater";
import { getUserProfile, getUserThreads, getViewsInsights } from "./threadsapi/api";
import { useDataFetcher } from "./threadsapi/store";

const App: FC = () => {
	useAccessTokenUpdater();
	useDataFetcher("user_profile", getUserProfile);
	useDataFetcher("user_threads", getUserThreads);
	useDataFetcher("user_insights_profile_views", getViewsInsights);
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
