import { KyInstance } from "ky";
import { create } from "zustand";
import { combine, createJSONStorage, devtools, persist } from "zustand/middleware";

import threadsapi from "@src/threadsapi";

import { AccessTokenResponse, BreakdownMetricTypeMap, SimplifedMetricTypeMap, UserProfileResponse } from "../threadsapi/types";

interface CacheStoreState {
	user_profile: UserProfileResponse | null;
	user_insights: SimplifedMetricTypeMap | null;
	user_follower_demographics: BreakdownMetricTypeMap | null;
	user_profile_refreshed_at: number;
}

export const cache_store = create(
	devtools(
		persist(
			combine(
				{
					user_profile_refreshed_at: 0,
					user_profile: null,
					user_insights: null,
					user_follower_demographics: null,
				} as CacheStoreState,
				(set) => {
					const loadUserData = async (ky: KyInstance, token: AccessTokenResponse) => {
						const prof = threadsapi.get_user_profile(ky, token).then((data) => {
							set(() => ({
								user_profile: data,
								user_profile_refreshed_at: new Date().getTime(),
							}));
						});

						const ins = threadsapi.get_user_insights(ky, token).then(async (data) => {
							set(() => ({
								user_insights: data,
							}));

							if (data.total_followers >= 100) {
								return threadsapi.get_follower_demographics(ky, token).then((data) => {
									set(() => ({
										user_follower_demographics: data,
									}));
								});
							}
						});

						await Promise.all([prof, ins]);

						return;
					};
					return {
						loadUserData,

						clearUserData: () => {
							set(() => {
								return {
									user_profile: null,
									user_insights: null,
									user_follower_demographics: null,
								};
							});
						},
					};
				},
			),
			{
				name: "unthread.me/cache_store",
				storage: createJSONStorage(() => localStorage, {}),
				version: 10,
			},
		),
	),
);

export default cache_store;
