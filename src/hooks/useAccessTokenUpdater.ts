import React from "react";
import { useSearchParams } from "react-router-dom";

import ky from "ky";

import useStore from "@src/threadsapi/store";
import { exchangeCodeForAccessToken } from "@src/threadsapi/api";

const useAccessTokenUpdater = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const updateAccessToken = useStore((state) => state.updateAccessToken);
	const updateIsLoggingIn = useStore((state) => state.updateIsLoggingIn);

	React.useEffect(() => {
		const code = searchParams.get("code");

		async function fetchAccessToken(code: string) {
			updateIsLoggingIn(true);
			try {
				console.log({ code });
				const kyd = ky.create({ prefixUrl: "https://api.unthread.me/" });
				const res = await exchangeCodeForAccessToken(kyd, code);
				updateAccessToken(res);
			} catch (error) {
				console.error("Error updating access token:", error);
			} finally {
				updateIsLoggingIn(false);
			}
		}

		if (code && code !== "") {
			fetchAccessToken(code)
				.then(() => {
					setSearchParams({});
				})
				.catch((err: unknown) => {
					console.error(err);
				});
		}
	}, [searchParams, setSearchParams, updateAccessToken, updateIsLoggingIn]);
};

export default useAccessTokenUpdater;
