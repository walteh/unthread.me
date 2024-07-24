import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";

export interface Change {
	description: string;
	date: string;
	type: "bug" | "feature" | "update";
	resolvedBy: string[];
	reportedBy: string[];
	commitHash: string;
}

// Define the changes that will be returned
export const changes: Change[] = [
	{
		description: "thread cache getting too large",
		type: "bug",
		date: "2024-07-24",
		resolvedBy: ["walt_eh"],
		reportedBy: ["firerock31"],
		commitHash: "48b3b7e7f57997ca0b96cfbc874711988bbf7dc3",
	},
];

// Create the Zustand store
const changelog_store = create(
	devtools(
		persist(
			combine(
				{
					last_seen_change: changes.length,
				},
				(set) => ({
					markAllChangesAsSeen: () => {
						set({ last_seen_change: changes.length });
					},
				}),
			),
			{
				name: "untrhead.me/changelog_store",
				getStorage: () => localStorage,
			},
		),
	),
);

export default changelog_store;
