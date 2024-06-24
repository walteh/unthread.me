import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import { store } from "@/app/store";

import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root");

if (!root || !(root instanceof HTMLElement)) {
	throw new Error("Root element not found");
}

ReactDOM.createRoot(root).render(
	<BrowserRouter>
		{/* <Provider store={store}> */}
		<App />
		{/* </Provider> */}
	</BrowserRouter>,
);
