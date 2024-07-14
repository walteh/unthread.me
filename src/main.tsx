import "./index.css";

import nightwind from "nightwind/helper";
import ReactDOM from "react-dom/client";
import { Helmet } from "react-helmet";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";

const root = document.getElementById("root");

if (!root || !(root instanceof HTMLElement)) {
	throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
	<BrowserRouter>
		<Helmet>
			<script>{nightwind.init()}</script>
		</Helmet>
		<App />
	</BrowserRouter>,
);
