import ky from "ky";
import React from "react";

import { AccessTokenResponse, getUserProfile, UserProfileResponse } from "@src/threadsapi/api";
import { useIsLoggedIn, useUserDataStore } from "@src/threadsapi/store";

const useUserProfileUpdater = () => {
	const setData = useUserDataStore((state) => state.updateData);
	const setLoading = useUserDataStore((state) => state.updateIsLoading);
	const setError = useUserDataStore((state) => state.updateError);

	const [isLoggedIn, accessToken] = useIsLoggedIn();

	React.useEffect(() => {
		async function fetchAccessTokenAndProfile(token: AccessTokenResponse) {
			setLoading("user_profile", true);
			try {
				const kyd = ky.create({ prefixUrl: "https://graph.threads.net" });
				const userProfile: UserProfileResponse = await getUserProfile(kyd, token);
				setData("user_profile", userProfile);
			} catch (error) {
				console.error("Error updating access token or fetching user profile:", error);
				setError("user_profile", "Failed to fetch user profile");
			} finally {
				setLoading("user_profile", false);
			}
		}

		if (isLoggedIn) {
			void fetchAccessTokenAndProfile(accessToken);
		}
	}, [accessToken, setLoading, setError, setData, isLoggedIn]);

	return null;
};

export default useUserProfileUpdater;
