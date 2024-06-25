import React, { FC } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { Outlet } from "react-router-dom";

import ky from "ky";
import LayoutHeader from "./components/LayoutHeader";
import LayoutFooter from "./components/LayoutFooter";
import NotFound from "@src/pages/NotFound";
import Home from "@src/pages/Home";
import useStore from "./threadsapi/store";
import { exchangeCodeForAccessToken } from "./threadsapi/api";

const useAccessTokenUpdater = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const updateAccessToken = useStore((state) => state.updateAccessToken);

	React.useEffect(() => {
		console.log({ searchParams });
		const code = searchParams.get("code");

		async function fetchAccessToken(code: string) {
			try {
				console.log({ code });
				const kyd = ky.create({ prefixUrl: "https://api.unthread.me/" });
				const res = await exchangeCodeForAccessToken(kyd, code);
				updateAccessToken(res);
			} catch (error) {
				console.error("Error updating access token:", error);
			}
		}

		if (code && code !== "") {
			// Call your async function to update access token

			fetchAccessToken(code)
				.then(() => {
					console.log("Token updated");
					setSearchParams({ code: "" });
					// Redirect to the home page
					// window.location.href = "/";
				})
				.catch((err: unknown) => {
					console.error(err);
				});
		}
	}, [searchParams, setSearchParams, updateAccessToken]);
};

const App: FC = () => {
	useAccessTokenUpdater();
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
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
