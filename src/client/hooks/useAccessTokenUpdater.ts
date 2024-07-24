import ky from "ky";
import React from "react";
import { useSearchParams } from "react-router-dom";

import client from "@src/client";
import { useIsLoggedIn } from "@src/client/hooks/useIsLoggedIn";
import useTokenStore from "@src/client/hooks/useTokenStore";
import threadsapi from "@src/threadsapi";

import thread_store from "../thread_store";
import useCacheStore from "./useCacheStore";

const useAccessTokenUpdater = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const updateAccessToken = useTokenStore((state) => state.updateAccessToken);
	const updateIsLoggingIn = client.session_store((state) => state.updateIsLoggingIn);
	const longLivedAccessToken = client.token_store((state) => state.long_lived_token);
	const longLivedTokenRefreshableAt = client.token_store((state) => state.long_lived_token_refreshable_at);
	const updateLongLivedAccessToken = client.token_store((state) => state.updateLongLivedToken);
	const accessToken = client.token_store((state) => state.access_token);
	const [isLoggedIn] = useIsLoggedIn();

	const refreshUserProfile = useCacheStore((state) => state.loadUserData);

	// const clearAccessToken = client.token_store((state) => state.clearAccessToken);

	// update the access token if a code is present in the URL
	React.useEffect(() => {
		const code = searchParams.get("code");

		async function fetchAccessToken(code: string) {
			updateIsLoggingIn(true);
			try {
				const kyd = ky.create({ prefixUrl: "https://api.unthread.me/" });

				const res = await threadsapi.exchange_code_for_short_lived_token(kyd, code);
				updateAccessToken(res);
				const kyd2 = ky.create({ prefixUrl: "https://graph.threads.net" });
				void refreshUserProfile(kyd2, res);
				void thread_store.loadThreadsData(kyd2, res);
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
	}, [searchParams, setSearchParams, updateAccessToken, updateIsLoggingIn, refreshUserProfile]);

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
						const newLongLivedToken = await threadsapi.exchange_short_lived_for_long_lived_token(kyd, accessToken);
						updateLongLivedAccessToken(newLongLivedToken);
					} catch (error) {
						console.error("Error generating long-lived access token:", error);
					}
				} else if (longLivedTokenRefreshableAt && new Date(longLivedTokenRefreshableAt) < new Date()) {
					try {
						const kyd = ky.create({ prefixUrl: "https://graph.threads.net" });
						const refreshedToken = await threadsapi.refresh_long_lived_token(kyd, longLivedAccessToken);
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
