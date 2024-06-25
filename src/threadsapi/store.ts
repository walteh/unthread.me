import ky, { KyInstance } from "ky";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AccessTokenResponse, exchangeCodeForAccessToken } from "./api";
import { useCallback } from "react";

interface ThreadsAPIStore {
	access_token: AccessTokenResponse | null;
	ky: () => KyInstance;
	updateCode: (code: string) => Promise<void>;
}

const useStore = create(
	persist<ThreadsAPIStore>(
		(set, get) => ({
			access_token: null,
			ky: () => ky.create({ prefixUrl: "https://api.unthread.me/", headers: {} }),

			updateCode: async (code: string) => {
				const newToken = await exchangeCodeForAccessToken(get().ky(), code);

				console.log({ newToken });

				set({ access_token: newToken });
			},
		}),
		{
			name: "threadsole/threads-api",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export const useUpdateCode = (token: string) => useStore(useCallback((state) => state.updateCode(token), [token]));

export default useStore;
