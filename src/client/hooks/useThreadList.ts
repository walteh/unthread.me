import { useLiveQuery } from "dexie-react-hooks";

import { calculateDayInPacificTime, calculateMonthInPacificTime, calculateWeekInPacificTime, getDayOfWeek } from "@src/lib/ml";

import { db as yo } from "../reply_store";
import { db, ThreadID } from "../thread_store";
import useCacheStore from "./useCacheStore";

const useThreadList = () => {
	const thread = useLiveQuery(async () => {
		const thread = await db.threads.toArray();
		return thread;
	}, []);

	return thread ?? [];
};

export const getThreadsListWithLabels = async () => {
	const thread = await db.threads.toArray();
	return thread.map((thread) => {
		return {
			...thread,
			week: calculateWeekInPacificTime(thread.media.timestamp),
			day: calculateDayInPacificTime(thread.media.timestamp),
			month: calculateMonthInPacificTime(thread.media.timestamp),
			day_of_week: getDayOfWeek(calculateDayInPacificTime(thread.media.timestamp)),
		};
	});
};
export const useThreadListWithLabels = () => {
	const thread = useLiveQuery(async () => {
		return getThreadsListWithLabels();
	}, []);

	return thread ?? [];
};

export const getReplyListWithLabels = async () => {
	const thread = await yo.replies.toArray();
	return thread.map((thread) => {
		return {
			...thread,
			week: calculateWeekInPacificTime(thread.media.timestamp),
			day: calculateDayInPacificTime(thread.media.timestamp),
			month: calculateMonthInPacificTime(thread.media.timestamp),
			day_of_week: getDayOfWeek(calculateDayInPacificTime(thread.media.timestamp)),
		};
	});
};

export const useReplyListWithLabels = () => {
	const thread = useLiveQuery(async () => {
		return getReplyListWithLabels();
	}, []);

	return thread ?? [];
};

export const useMyReplyList = () => {
	const profile = useCacheStore((state) => state.user_profile);
	const thread = useLiveQuery(async () => {
		const thread = await yo.replies.where({ username: profile?.username ?? "invalid" }).toArray();
		return thread;
	}, []);

	return thread ?? [];
};

export const useReplyListByThreadIDList = () => {
	const thread = useLiveQuery(async () => {
		const thread = await yo.replies.toArray();
		return thread.reduce<Record<ThreadID, typeof thread>>((acc, thread) => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (!acc[thread.thread_id]) {
				acc[thread.thread_id] = [];
			}
			acc[thread.thread_id].push(thread);
			return acc;
		}, {});
	}, []);

	return thread ?? {};
};

export default useThreadList;
