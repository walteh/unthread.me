import { exchangeCodeForAccessToken } from "@src/threadsapi/api";
import { useInMemoryStore, usePersistantStore } from "@src/threadsapi/store";
import ky from "ky";
import React from "react";
import { useSearchParams } from "react-router-dom";

const useAccessTokenUpdater = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const updateAccessToken = usePersistantStore((state) => state.updateAccessToken);
	const updateIsLoggingIn = useInMemoryStore((state) => state.updateIsLoggingIn);
	// const clearAccessToken = usePersistantStore((state) => state.clearAccessToken);

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
	// React.useEffect(() => {
	// 	if (access_token_expires_in <= 0) {
	// 		clearAccessToken();
	// 	}
	// }, [access_token_expires_in, clearAccessToken]);
};

export default useAccessTokenUpdater;
