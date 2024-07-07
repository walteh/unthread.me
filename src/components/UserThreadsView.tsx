import { FC, useState } from "react";

import useThreadInfo from "@src/client/hooks/useThreadInfo";
import useThreadsListSortedByDate from "@src/client/hooks/useThreadsListByDate";
import { Reply, ThreadMedia } from "@src/threadsapi/types";

const UserThreadsView = () => {
	const [threads] = useThreadsListSortedByDate();

	const [search, setSearch] = useState("");

	return (
		<div className="container mx-auto p-6">
			<div>
				<div className="flex justify-center flex-row">
					<div className="relative mt-2 flex items-center mb-2 w-1/2">
						<input
							type="text"
							name="search"
							id="search"
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
							}}
							className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
						/>
						<div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
							<kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
								⌘K
							</kbd>
						</div>
					</div>
				</div>
				<div className="space-y-6">
					{threads.map((thread) => (
						<div
							key={thread.id}
							className={`bg-white p-6 rounded-lg shadow-lg ${thread.text?.includes(search) ? "" : "hidden"}`}
						>
							<ThreadCard thread={thread} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

const ThreadCard: FC<{ thread: ThreadMedia }> = ({ thread }) => {
	const [likes, views, replies] = useThreadInfo(thread);

	return (
		<div>
			<div className="mb-4">
				<h2 className="text-xl font-semibold">@{thread.username}</h2>
				<p className="text-sm text-gray-500">{new Date(thread.timestamp).toLocaleString()}</p>
				<span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
					<svg className="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
						<circle cx={3} cy={3} r={3} />
					</svg>
					{likes} likes
				</span>
				<span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
					<svg className="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
						<circle cx={3} cy={3} r={3} />
					</svg>
					{views} views
				</span>
			</div>
			<p className="mb-4 " style={{ whiteSpace: "pre-wrap" }}>
				{thread.text}
			</p>
			{thread.media_url && (
				<div className="mb-4">
					{thread.media_type === "IMAGE" && <img src={thread.media_url} alt="Media" className="rounded-lg" />}
					{thread.media_type === "VIDEO" && <video src={thread.media_url} controls className="rounded-lg" />}
				</div>
			)}
			{/* <div>
				<h3 className="text-lg font-semibold mb-2">Replies</h3>
				<UserThreadRepliesDisplay replies={replies} pad={0} />
			</div> */}
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
						{reply.has_replies && reply.children?.length !== 0 && (
							<div className="mt-4">
								<h4 className="text-sm font-semibold">Replies</h4>
								<UserThreadRepliesDisplay replies={reply.children ?? []} pad={pad + 1} />
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default UserThreadsView;
