import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";

interface FeatureFlagStore {
	enable_alpha_i_know_what_im_doing: boolean;
}

export const feature_flag_store = create(
	persist(
		devtools(
			combine(
				{
					enable_alpha_i_know_what_im_doing: false,
				} as FeatureFlagStore,
				() => ({}),
			),
		),
		{
			name: "unthread.me/feature_flag_store",
			// getStorage: () => sessionStorage,
			version: 0,
		},
	),
);

export default feature_flag_store;
