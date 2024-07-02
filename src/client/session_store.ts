import { create } from "zustand";
import { combine, devtools } from "zustand/middleware";

import { TimePeriodLabel } from "../threadsapi/types";

interface InMemoryStore {
	is_logging_in: boolean;
	time_period_label: TimePeriodLabel;
	route: string | undefined;

	error: Error | undefined;

	darkmode: DarkModePreferences;
	dimentions: Dimensions;
}

export enum Theme {
	DARK,
	LIGHT,
}

export interface DarkModePreferences {
	user: Theme | undefined;
	media: Theme | undefined;
}
export interface Dimensions {
	height: number;
	width: number;
}

export const session_store = create(
	devtools(
		combine(
			{
				is_logging_in: false,
				time_period_label: "last7days" as TimePeriodLabel,
				route: undefined,
				error: undefined,
				darkmode: {
					user: undefined,
					media: undefined,
				},
				dimentions: {
					height: window.innerHeight,
					width: window.innerWidth,
				},
			} as InMemoryStore,
			(set) => ({
				updateIsLoggingIn: (is_logging_in: boolean) => {
					set({ is_logging_in });
				},
				updateTimePeriodLabel: (time_period_label: TimePeriodLabel) => {
					set({ time_period_label });
				},
				// updateUserThreadsTextSegments: (thread_id: string, segments: WordSegment | null) => {
				// 	set((state) => ({
				// 		user_threads_text_segments: {
				// 			...state.user_threads_text_segments,
				// 			[thread_id]: segments,
				// 		},
				// 	}));
				// },
			}),
		),
	),
);

export default session_store;
