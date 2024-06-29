import { FC } from "react";

import ErrorMessage from "@src/components/ErrorMessage";
import Loader from "@src/components/Loader";
import { Reply, ThreadMedia } from "@src/threadsapi/api";
import { useUserDataStore } from "@src/threadsapi/store";

const UserThreadsView = () => {
	const threads = useUserDataStore((state) => state.user_threads);

	if (!threads) return null;

	if (threads.is_loading) return <Loader />;
	if (threads.error) return <ErrorMessage message={threads.error} />;

	return (
		<div className="container mx-auto p-6">
			{threads.data ? (
				<div>
					<h1 className="text-3xl font-bold text-center mb-8">User Threads</h1>
					<div className="space-y-6">
						{threads.data.data.map((thread) => (
							<div key={thread.id} className="bg-white p-6 rounded-lg shadow-lg">
								<ThreadCard thread={thread} />
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="text-center text-gray-500">No threads data available</div>
			)}
		</div>
	);
};

const ThreadCard: FC<{ thread: ThreadMedia }> = ({ thread }) => (
	<div>
		<div className="mb-4">
			<h2 className="text-xl font-semibold">@{thread.username}</h2>
			<p className="text-sm text-gray-500">{new Date(thread.timestamp).toLocaleString()}</p>
		</div>
		<p className="mb-4">{thread.text}</p>
		{thread.media_url && (
			<div className="mb-4">
				{thread.media_type === "IMAGE" && <img src={thread.media_url} alt="Media" className="rounded-lg" />}
				{thread.media_type === "VIDEO" && <video src={thread.media_url} controls className="rounded-lg" />}
			</div>
		)}
		<div>
			<h3 className="text-lg font-semibold mb-2">Replies</h3>
			<UserThreadReplies thread_id={thread.id} />
		</div>
	</div>
);

const UserThreadReplies: FC<{ thread_id: string }> = ({ thread_id }) => {
	const replies = useUserDataStore((state) => state.user_threads_replies?.data[thread_id]);

	return (
		<div>
			{replies?.data ? (
				<UserThreadRepliesDisplay replies={replies.data} pad={0} />
			) : (
				<div className="text-gray-500">No replies available</div>
			)}
		</div>
	);
};

const UserThreadRepliesDisplay: FC<{ replies: Reply[]; pad: number }> = ({ replies, pad }) => {
	return (
		<div>
			<div className="space-y-4" style={{ paddingLeft: `${pad}rem` }}>
				{replies.map((reply) => (
					<div key={reply.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
						<div className="flex items-center mb-2">
							<p className="text-sm font-semibold">@{reply.username}</p>
							<p className="text-xs text-gray-500 ml-2">{new Date(reply.timestamp).toLocaleString()}</p>
						</div>
						<p className="text-sm">{reply.text}</p>
						{reply.media_url && (
							<div className="mt-2">
								{reply.media_type === "IMAGE" && <img src={reply.media_url} alt="Media" className="rounded-lg" />}
								{reply.media_type === "VIDEO" && <video src={reply.media_url} controls className="rounded-lg" />}
							</div>
						)}
						{reply.children && (
							<div className="mt-4">
								<h4 className="text-sm font-semibold">Replies</h4>
								<UserThreadRepliesDisplay replies={reply.children} pad={pad + 5} />
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default UserThreadsView;
