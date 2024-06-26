import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { AccessTokenResponse } from "./api";

interface PersistantStore {
	access_token: AccessTokenResponse | null;
	access_token_expires_at: number | null;

	updateAccessToken: (access_token: AccessTokenResponse) => void;
}

export const usePersistantStore = create(
	devtools(
		persist<PersistantStore>(
			(set) => ({
				access_token: null,
				access_token_expires_at: null,

				updateAccessToken: (access_token: AccessTokenResponse) => {
					set({ access_token, access_token_expires_at: Date.now() + 60 * 60 * 1000 }); // 1 hour
				},
			}),
			{
				name: "threadsole/threads-api",
				storage: createJSONStorage(() => localStorage),
			},
		),
	),
);

interface InMemoryStore {
	is_logging_in: boolean;

	updateIsLoggingIn: (is_logging_in: boolean) => void;
}

export const useInMemoryStore = create(
	devtools<InMemoryStore>((set) => ({
		is_logging_in: false,

		updateIsLoggingIn: (is_logging_in: boolean) => {
			set({ is_logging_in });
		},
	})),
);
