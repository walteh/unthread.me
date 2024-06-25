import React, { FC } from "react";
import { Route, HashRouter, Routes, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

import LayoutHeader from "./components/LayoutHeader";
import LayoutFooter from "./components/LayoutFooter";
import NotFound from "@src/pages/NotFound";
import Home from "@src/pages/Home";
import useStore from "./threadsapi/store";

const useAccessTokenUpdater = () => {
	const location = useLocation();
	const updateAccessToken = useStore((state) => state.updateCode); // Replace with your Zustand store update function

	React.useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const code = queryParams.get("code");

		async function fetchAccessToken(code: string) {
			try {
				await updateAccessToken(code);
			} catch (error) {
				console.error("Error updating access token:", error);
			}
		}

		if (code && code !== "") {
			// Call your async function to update access token

			fetchAccessToken(code)
				.then(() => {
					console.log("Token updated");
					location.search = "";
					// Redirect to the home page
					// window.location.href = "/";
				})
				.catch((err: unknown) => {
					console.error(err);
				});
		}
	}, [location, location.search, updateAccessToken]);
};

const App: FC = () => {
	useAccessTokenUpdater();
	return (
		<>
			<HashRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="*" element={<NotFound />} />
					</Route>
				</Routes>
			</HashRouter>
		</>
	);
};

const Layout: FC = () => {
	return (
		<div className="h-screen overflow-x-hidden">
			<LayoutHeader />
			<main>
				<Outlet />
			</main>
			<LayoutFooter />
		</div>
	);
};

export default App;
