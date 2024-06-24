import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "@/app/Layout";
import { Home, NoMatch } from "@/pages";

import useStore from "../threadsapi/store";

const OAuthCallback: FC = () => {
	// Get the token from the URL query parameters
	const urlParams = new URLSearchParams(window.location.search);
	const token = urlParams.get("token");

	if (!token) {
		throw new Error("Token not found in the URL query parameters");
	}

	useStore.setState({ token });

	console.log("Token updated");

	// Redirect to the home page
	window.location.href = "/";

	// Render null since this component doesn't need to render anything
	return null;
};

const App: FC = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="*" element={<NoMatch />} />
					<Route path="auth-redirect" element={<OAuthCallback />} />
				</Route>
			</Routes>
		</>
	);
};

export default App;
