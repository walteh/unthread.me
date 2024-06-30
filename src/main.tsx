import "./index.css";

// import "flowbite";
// import "preline";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";

const root = document.getElementById("root");

if (!root || !(root instanceof HTMLElement)) {
	throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
);
