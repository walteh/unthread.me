import { useLiveQuery } from "dexie-react-hooks";

import { db, ThreadID } from "../thread_store";

const useThread = (id: ThreadID) => {
	const thread = useLiveQuery(async () => {
		const thread = await db.threads.get(id);
		return thread;
	}, [id]);

	return thread;
};

export default useThread;
