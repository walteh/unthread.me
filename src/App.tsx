import { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "@src/pages/Home";

import useAccessTokenUpdater from "./hooks/useAccessTokenUpdater";

const App: FC = () => {
	useAccessTokenUpdater();
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
