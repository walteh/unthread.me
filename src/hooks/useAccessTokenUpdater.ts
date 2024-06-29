import ky from "ky";
import React from "react";
import { useSearchParams } from "react-router-dom";

import { exchangeAccessTokenForLongLivedCode, exchangeCodeForAccessToken, refreshLongLivedToken } from "@src/threadsapi/api";
import { useInMemoryStore, useIsLoggedIn, usePersistantStore } from "@src/threadsapi/store";

const useAccessTokenUpdater = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const updateAccessToken = usePersistantStore((state) => state.updateAccessToken);
	const updateIsLoggingIn = useInMemoryStore((state) => state.updateIsLoggingIn);
	const longLivedAccessToken = usePersistantStore((state) => state.long_lived_token);
	const longLivedTokenRefreshableAt = usePersistantStore((state) => state.long_lived_token_refreshable_at);
	const updateLongLivedAccessToken = usePersistantStore((state) => state.updateLongLivedToken);
	const accessToken = usePersistantStore((state) => state.access_token);
	const [isLoggedIn] = useIsLoggedIn();
	// const clearAccessToken = usePersistantStore((state) => state.clearAccessToken);

	// update the access token if a code is present in the URL
	React.useEffect(() => {
		const code = searchParams.get("code");

		async function fetchAccessToken(code: string) {
			updateIsLoggingIn(true);
			try {
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

	/// generate or refresh long-lived access token
	// if long lived access token is not present and short-lived access token is present -> generate long-lived access token
	// if the long live toekn eksts, but can be refreshed -> refresh the long-lived access token
	// Generate or refresh long-lived access token
	React.useEffect(() => {
		async function manageLongLivedToken() {
			if (isLoggedIn) {
				if (!longLivedAccessToken) {
					console.log("Generating long-lived access token");
					try {
						const kyd = ky.create({ prefixUrl: "https://api.unthread.me" });
						const newLongLivedToken = await exchangeAccessTokenForLongLivedCode(kyd, accessToken);
						updateLongLivedAccessToken(newLongLivedToken);
					} catch (error) {
						console.error("Error generating long-lived access token:", error);
					}
				} else if (longLivedTokenRefreshableAt && new Date(longLivedTokenRefreshableAt) < new Date()) {
					try {
						const kyd = ky.create({ prefixUrl: "https://graph.threads.net" });
						const refreshedToken = await refreshLongLivedToken(kyd, longLivedAccessToken);
						updateLongLivedAccessToken(refreshedToken);
					} catch (error) {
						console.error("Error refreshing long-lived access token:", error);
					}
				}
			}
		}

		void manageLongLivedToken();
	}, [accessToken, longLivedAccessToken, updateLongLivedAccessToken, isLoggedIn, longLivedTokenRefreshableAt]);
};

export default useAccessTokenUpdater;
