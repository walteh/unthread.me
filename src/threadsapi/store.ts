import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AccessTokenResponse } from "./api";

interface ThreadsAPIStore {
	access_token: AccessTokenResponse | null;
	is_logging_in: boolean;
	updateAccessToken: (access_token: AccessTokenResponse) => void;
	updateIsLoggingIn: (is_logging_in: boolean) => void;
}

const useStore = create(
	persist<ThreadsAPIStore>(
		(set) => ({
			access_token: null,
			is_logging_in: false,

			updateAccessToken: (access_token: AccessTokenResponse) => {
				set({ access_token });
			},
			updateIsLoggingIn: (is_logging_in: boolean) => {
				set({ is_logging_in });
			},
		}),
		{
			name: "threadsole/threads-api",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export default useStore;
