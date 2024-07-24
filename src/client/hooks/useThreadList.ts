import { useLiveQuery } from "dexie-react-hooks";

import { db } from "../thread_store";

const useThreadList = () => {
	const thread = useLiveQuery(async () => {
		const thread = await db.threads.toArray();
		return thread;
	}, []);

	return thread ?? [];
};

export default useThreadList;
