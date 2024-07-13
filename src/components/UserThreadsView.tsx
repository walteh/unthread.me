import { FC, useState } from "react";

import useThreadInfo from "@src/client/hooks/useThreadInfo";
import useThreadsListSortedByDate from "@src/client/hooks/useThreadsListByDate";
import { Reply, ThreadMedia } from "@src/threadsapi/types";

const UserThreadsView = () => {
	const [threads] = useThreadsListSortedByDate();

	const [search, setSearch] = useState("");

	return (
		<div className="container mx-auto sm:p-6">
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
					</div>
				</div>
				<div className="space-y-6  overflow-y-scroll">
					{threads.map((thread) => (
						<div
							key={thread.id}
							className={`bg-white sm:p-6 rounded-xl shadow-md m-1 ${thread.text?.includes(search) ? "" : "hidden"}`}
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
	const [likes, views, replies, quotes, reposts] = useThreadInfo(thread);

	return (
		<div className="px-4 py-2">
			<div className="mb-4 flex justify-between items-center">
				<p className="text-3xl font-bold font-rounded text-gray-900">@{thread.username}</p>
				<p className="text-lg text-gray-500">{new Date(thread.timestamp).toLocaleString()}</p>
			</div>

			<div className="flex flex-wrap gap-2 mb-4">
				<span className="inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-md font-medium text-gray-800">
					{thread.media_type}
				</span>
				{likes > 0 && (
					<span className="inline-flex items-center gap-x-1.5 rounded-full bg-red-100 px-3 py-2 text-md font-medium text-red-800">
						<svg className="h-3 w-3 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{likes} likes
					</span>
				)}
				<span className="inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 px-3 py-2 text-md font-medium text-blue-800">
					<svg className="h-3 w-3 fill-blue-500" viewBox="0 0 6 6" aria-hidden="true">
						<circle cx={3} cy={3} r={3} />
					</svg>
					{views} views
				</span>
				{replies.length > 0 && (
					<span className="inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-3 py-2 text-md font-medium text-green-800">
						<svg className="h-3 w-3 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{replies.length} replies
					</span>
				)}
				{quotes > 0 && (
					<span className="inline-flex items-center gap-x-1.5 rounded-full bg-purple-100 px-3 py-2 text-md font-medium text-purple-800">
						<svg className="h-3 w-3 fill-purple-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{quotes} quotes
					</span>
				)}
				{reposts > 0 && (
					<span className="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-3 py-2 text-md font-medium text-yellow-800">
						<svg className="h-3 w-3 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{reposts} reposts
					</span>
				)}
				{thread.is_quote_post && (
					<span className="inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-md font-medium text-gray-800">
						QUOTE
					</span>
				)}
			</div>
			<p className="sm:text-3xl text-lg font-mono text-gray-800 bg-slate-100 px-5 py-3 rounded-lg" style={{ whiteSpace: "pre-wrap" }}>
				{thread.text}
			</p>
			{thread.media_url && (
				<div className="p-5 mt-4 flex justify-center max-w-full">
					{(thread.media_type === "IMAGE" || thread.media_type === "CAROUSEL_ALBUM") && (
						<img src={thread.media_url} alt="Media" className="rounded-lg  border-solid shadow-2xl" />
					)}
					{thread.media_type === "VIDEO" && <video src={thread.media_url} controls className="rounded-lg shadow-2xl" />}
					{thread.media_type === "AUDIO" && <audio src={thread.media_url} controls className="rounded-lg shadow-2xl" />}
					{/* {thread.is_quote_post &&
						thread.children?.map((quote) => (
							<div key={quote.id} className="bg-gray-100 p-4 rounded-lg shadow-sm mt-4">
								<p className="text-sm font-semibold">@{quote.username}</p>
								<p className="text-sm">{quote.text}</p>
							</div>
						))} */}
				</div>
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
