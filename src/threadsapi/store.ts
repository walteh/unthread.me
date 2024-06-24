import ky, { KyInstance } from "ky";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { fetchAccessToken, refreshAccessToken } from "./api";
import { useCallback } from "react";

interface ThreadsAPIStore {
	secret: string;
	base: string;
	token: string;
	ky: () => KyInstance;

	refreshToken: () => Promise<void>;
	getToken: () => Promise<void>;
}

const useStore = create(
	persist<ThreadsAPIStore>(
		(set, get) => ({
			secret: "",
			base: "https://graph.threads.net",
			token: "",
			ky: () => ky.create({ prefixUrl: get().base, headers: { "content-type": "application/json" } }),

			refreshToken: async () => {
				const { token } = get();
				const newToken = await refreshAccessToken(get().ky(), token);
				set({ token: newToken });
			},

			getToken: async () => {
				const { secret, token } = get();
				const newToken = await fetchAccessToken(get().ky(), secret, token);
				set({ token: newToken });
			},
		}),
		{
			name: "threadsole/threads-api",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export const useUpdateToken = (token: string) => useStore(useCallback((state) => (state.token = token), [token]));

export default useStore;
