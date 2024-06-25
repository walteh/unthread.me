import ky, { KyInstance } from "ky";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AccessTokenResponse } from "./api";

interface ThreadsAPIStore {
	access_token: AccessTokenResponse | null;
	ky: () => KyInstance;
	updateAccessToken: (access_token: AccessTokenResponse) => void;
}

const useStore = create(
	persist<ThreadsAPIStore>(
		(set) => ({
			access_token: null,
			ky: () => ky.create({ prefixUrl: "https://api.unthread.me/", headers: {} }),

			updateAccessToken: (access_token: AccessTokenResponse) => {
				set({ access_token });
			},
		}),
		{
			name: "threadsole/threads-api",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export default useStore;
