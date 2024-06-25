import { FC } from "react";
import { Route, HashRouter, Routes } from "react-router-dom";
import { Outlet } from "react-router-dom";

import LayoutHeader from "./components/LayoutHeader";
import LayoutFooter from "./components/LayoutFooter";
import NotFound from "@src/pages/NotFound";
import Home from "@src/pages/Home";
import OAuthCallback from "@src/pages/OAuthCallback";

const App: FC = () => {
	return (
		<>
			<HashRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="*" element={<NotFound />} />
						<Route path="oauth/callback" element={<OAuthCallback />} />
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
