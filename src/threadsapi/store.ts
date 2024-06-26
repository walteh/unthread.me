import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AccessTokenResponse } from "./api";

interface ThreadsAPIStore {
	access_token: AccessTokenResponse | null;
	access_token_expires_at: number | null;
	is_logging_in: boolean;
	updateAccessToken: (access_token: AccessTokenResponse) => void;
	updateIsLoggingIn: (is_logging_in: boolean) => void;
	clearAccessToken: () => void;
}

const useStore = create(
	persist<ThreadsAPIStore>(
		(set) => ({
			access_token: null,
			is_logging_in: false,
			access_token_expires_at: null,

			updateAccessToken: (access_token: AccessTokenResponse) => {
				set({ access_token, access_token_expires_at: Date.now() + 60 * 60 * 1000 }); // 1 hour
			},

			updateIsLoggingIn: (is_logging_in: boolean) => {
				set({ is_logging_in });
			},

			clearAccessToken: () => {
				set({ access_token: null, access_token_expires_at: null });
			},
		}),
		{
			name: "threadsole/threads-api",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export default useStore;
