import { FC } from "react";
import { Link } from "react-router-dom";
import { useUpdateCode } from "../threadsapi/store";

const NotFound: FC = () => {
	const urlParams = new URLSearchParams(location.search);
	const code = urlParams.get("code");

	if (!code) {
		throw new Error("Token not found in the URL query parameters");
	}

	void useUpdateCode(code)
		.then(() => {
			console.log("Token updated");
			window.location.href = "/";
		})
		.catch((err: unknown) => {
			console.error(err);
		});

	return (
		<section>
			<div className="flex min-h-screen w-screen flex-col items-center justify-center gap-y-5">
				<h1 className="bg-gradient-to-l from-primary-content via-secondary to-primary bg-clip-text text-9xl font-bold text-transparent">
					404
				</h1>
				<p className="text-3xl font-medium text-neutral">Page not found</p>
				<Link className="btn-primary-content btn px-16" to="/">
					Go back
				</Link>
			</div>
		</section>
	);
};

export default NotFound;
