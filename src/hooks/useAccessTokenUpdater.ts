import React from "react";
import { useSearchParams } from "react-router-dom";

import ky from "ky";

import useStore from "@src/threadsapi/store";
import { exchangeCodeForAccessToken } from "@src/threadsapi/api";
import useAccessTokenExpiresIn from "./useAccessTokenExpiresIn";

const useAccessTokenUpdater = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const updateAccessToken = useStore((state) => state.updateAccessToken);
	const updateIsLoggingIn = useStore((state) => state.updateIsLoggingIn);
	const clearAccessToken = useStore((state) => state.clearAccessToken);
	const access_token_expires_in = useAccessTokenExpiresIn();

	// update the access token if a code is present in the URL
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

	// delete the access token if it has expired
	React.useEffect(() => {
		if (access_token_expires_in <= 0) {
			clearAccessToken();
		}
	}, [access_token_expires_in, clearAccessToken]);
};

export default useAccessTokenUpdater;
