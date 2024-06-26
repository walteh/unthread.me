import { FC } from "react";
import { useLocation } from "react-router-dom";

const OAuthCallback: FC = () => {
	const location = useLocation();

	// Get the token from the URL query parameters
	const urlParams = new URLSearchParams(location.search);
	const code = urlParams.get("code");

	if (!code) {
		throw new Error("Token not found in the URL query parameters");
	}

	// void useUpdateCode(code)
	// 	.then(() => {
	// 		console.log("Token updated");
	// 		// window.location.href = "/";
	// 	})
	// 	.catch((err: unknown) => {
	// 		console.error(err);
	// 	});

	// Redirect to the home page

	// Render null since this component doesn't need to render anything
	return null;
};

export default OAuthCallback;
