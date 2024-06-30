import { create } from "zustand";
import { combine, createJSONStorage, devtools, persist } from "zustand/middleware";

import { AccessTokenResponse, LongTermAccessTokenResponse } from "../threadsapi/types";

interface TokenStore {
	access_token: AccessTokenResponse;
	access_token_expires_at: number | null;
	long_lived_token: LongTermAccessTokenResponse | null;
	long_lived_token_expires_at: number | null;
	long_lived_token_refreshable_at: number | null;
}

export const token_store = create(
	devtools(
		persist(
			combine(
				{
					access_token: {} as AccessTokenResponse,
					access_token_expires_at: null,
					long_lived_token: null,
					long_lived_token_expires_at: null,
					long_lived_token_refreshable_at: null,
				} as TokenStore,
				(set) => ({
					updateAccessToken: (access_token: AccessTokenResponse) => {
						set({ access_token, access_token_expires_at: Date.now() + 60 * 60 * 1000 }); // 1 hour
					},
					updateLongLivedToken: (long_lived_token: LongTermAccessTokenResponse) => {
						set({
							long_lived_token,
							long_lived_token_expires_at: Date.now() + long_lived_token.expires_in * 1000,
							long_lived_token_refreshable_at: Date.now() + 24 * 60 * 60 * 1000, // 24 hours - from docs
						});
					},
				}),
			),
			{
				name: "unthread.me/token_store",
				storage: createJSONStorage(() => localStorage),
			},
		),
	),
);

export default token_store;
