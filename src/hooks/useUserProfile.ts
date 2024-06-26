import ky from "ky";
import React from "react";

import { AccessTokenResponse, getUserProfile, UserProfileResponse } from "@src/threadsapi/api";
import { usePersistantStore } from "@src/threadsapi/store";

const useUserProfile = () => {
	const [profile, setProfile] = React.useState<UserProfileResponse | null>(null);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string | null>(null);
	const accessToken = usePersistantStore((state) => state.access_token);

	React.useEffect(() => {
		async function fetchAccessTokenAndProfile(token: AccessTokenResponse) {
			setIsLoading(true);
			try {
				const kyd = ky.create({ prefixUrl: "https://graph.threads.net" });
				const userProfile: UserProfileResponse = await getUserProfile(kyd, token);
				setProfile(userProfile);
				setError(null);
			} catch (error) {
				console.error("Error updating access token or fetching user profile:", error);
				setError("Failed to fetch user profile");
			} finally {
				setIsLoading(false);
			}
		}

		if (accessToken) {
			void fetchAccessTokenAndProfile(accessToken);
		}
	}, [accessToken]);

	return [profile, isLoading, error] as const;
};

export default useUserProfile;
