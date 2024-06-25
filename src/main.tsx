import ReactDOM from "react-dom/client";

import App from "./App.tsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

const root = document.getElementById("root");

if (!root || !(root instanceof HTMLElement)) {
	throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
);
