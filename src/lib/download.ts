import { saveAs } from "file-saver";

import { getReplyListWithLabels, getThreadsListWithLabels } from "@src/client/hooks/useThreadList";

export const handleDownloadThreads = async () => {
	const allThreads = await getThreadsListWithLabels();
	const threadData = JSON.stringify(allThreads, null, "\t");
	const blob = new Blob([threadData], { type: "application/json" });
	saveAs(blob, `unthreadme_threads_${new Date().toISOString()}.json`);
};

export const handleDownloadReplies = async () => {
	const allReplies = await getReplyListWithLabels();
	const replyData = JSON.stringify(allReplies, null, "\t");
	const blob = new Blob([replyData], { type: "application/json" });
	saveAs(blob, `unthreadme_replies_${new Date().toISOString()}.json`);
};
