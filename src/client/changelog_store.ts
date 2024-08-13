import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";

export interface Change {
	description: string;
	date: string;
	type: "bug" | "feature" | "update";
	resolvedBy: string[];
	reportedBy: string[];
	commitHash: string;
	permalink?: string;
}

//
// Define the changes that will be returned
export const changes: Change[] = [
	{
		description: "thread cache getting too large - move to indexeddb",
		type: "bug",
		date: "2024-07-24",
		resolvedBy: ["walt_eh"],
		reportedBy: ["firerock31"],
		commitHash: "48b3b7e7f57997ca0b96cfbc874711988bbf7dc3",
	},
	{
		description: "add new alpha changes list",
		type: "feature",
		date: "2024-07-24",
		resolvedBy: ["walt_eh"],
		reportedBy: ["walt_eh"],
		commitHash: "cab5f7b921ee7c7a8d9251176ed1ebc818f29d52",
	},
	{
		description: "add engagement rate stats",
		type: "feature",
		date: "2024-08-02",
		resolvedBy: ["walt_eh"],
		reportedBy: ["walt_eh"],
		commitHash: "f58aae39afce906fb48f8626eec42bb6b96c2e63",
	},
	{
		description: "chart not rerendering correcly",
		type: "bug",
		date: "2024-08-02",
		resolvedBy: ["walt_eh"],
		reportedBy: ["firerock31"],
		commitHash: "2500e449944b1fa52e675c0a408c809366c76677",
	},
	{
		description: "add engagement rate stats to charts",
		type: "feature",
		date: "2024-08-02",
		resolvedBy: ["walt_eh"],
		reportedBy: ["firerock31"],
		commitHash: "2500e449944b1fa52e675c0a408c809366c76677",
	},
	{
		description: "fix reach display number",
		type: "bug",
		date: "2024-08-07",
		resolvedBy: ["walt_eh"],
		reportedBy: ["mrjoshuapack"],
		commitHash: "2f58a75d9524e4811b8e1aa65abd96d1e4378485",
	},

	{
		description: "support for replies",
		type: "feature",
		date: "2024-08-12",
		resolvedBy: ["walt_eh"],
		reportedBy: ["walt_eh"],
		commitHash: "0eafbbad8a30cc1ee600494fc8fb75f739fa450f",
	},

	{
		description: "case insensitive search",
		type: "feature",
		date: "2024-08-13",
		resolvedBy: ["walt_eh"],
		reportedBy: ["w3stfa11"],
		commitHash: "ddcc2a388c3e8bbd9c1af8aaa1db0c2ce7adbfe4",
		permalink: "https://www.threads.net/@w3stfa11/post/C-lgELPJJew?xmt=AQGzSCgiSnR-Q2Sl0KuswyNVWMmBuGeMcmk31Ga9CRbd5w",
	},
];

const changelog_store = create(
	devtools(
		persist(
			combine(
				{
					last_seen_change: 0,
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
				version: 1,
			},
		),
	),
);

export default changelog_store;
