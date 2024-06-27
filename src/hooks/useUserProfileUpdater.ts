import ky from "ky";
import React from "react";

import { AccessTokenResponse, getUserProfile, UserProfileResponse } from "@src/threadsapi/api";
import { usePersistantStore, useUserDataStore } from "@src/threadsapi/store";

const useUserProfileUpdater = () => {
	const setData = useUserDataStore((state) => state.updateData);
	const setLoading = useUserDataStore((state) => state.updateIsLoading);
	const setError = useUserDataStore((state) => state.updateError);

	const accessToken = usePersistantStore((state) => state.access_token);

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

		if (accessToken) {
			void fetchAccessTokenAndProfile(accessToken);
		}
	}, [accessToken, setLoading, setError, setData]);

	return null;
};

export default useUserProfileUpdater;
