import { FC, useState } from "react";

import { useReplyEngagementRate, useThreadEngagementRate } from "@src/client/hooks/useEngagementRate";
import useThread, { useAllReplyReplies, useAllThreadReplies, useReply } from "@src/client/hooks/useThread";
import { useThreadsAndReplyListSortedByDate } from "@src/client/hooks/useThreadsListByDate";
import { ReplyID } from "@src/client/reply_store";
import { ThreadID } from "@src/client/thread_store";
import { formatNumber } from "@src/lib/ml";
import { Reply } from "@src/threadsapi/types";

const UserThreadsView = () => {
	const [threads] = useThreadsAndReplyListSortedByDate();
	const [search, setSearch] = useState("");
	const [viewType, setViewType] = useState("posts"); // "all", "posts", or "replies"

	const filteredThreads = threads
		.filter((thread) => {
			return viewType === "combined"
				? true
				: viewType === "posts"
					? thread.type === "thread"
					: viewType === "replies"
						? thread.type === "reply"
						: false;
		})
		.filter((thread) => {
			return (thread.media.text ?? "").toLowerCase().includes(search.toLowerCase());
		});

	return (
		<div className="container mx-auto sm:p-6 p-2 flex flex-col items-center">
			<div className="flex justify-center items-center mt-4 w-full">
				<div className="relative w-full sm:w-1/2 flex items-center space-x-4">
					<input
						type="text"
						name="search"
						id="search"
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
						}}
						className="block w-full rounded-full py-2 pl-12 pr-4 text-gray-900 shadow-2xl placeholder:text-gray-400 sm:text-sm sm:leading-6 font-mono bg-gray-50 border-4"
						placeholder="search..."
					/>
					<span className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
					<select
						value={viewType}
						onChange={(e) => {
							setViewType(e.target.value);
						}}
						className="rounded-full py-2 px-4 text-gray-900 shadow-2xl sm:text-sm sm:leading-6 font-mono bg-gray-50 border-4 w-40"
					>
						<option value="combined">combined</option>
						<option value="posts">posts only</option>
						<option value="replies">replies only</option>
					</select>
				</div>
			</div>
			<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
				{filteredThreads.map((thread, idx) => (
					<div key={thread.type === "thread" ? thread.thread_id : thread.reply_id}>
						{thread.type === "thread" ? (
							<ThreadCard threadid={thread.thread_id} idx={filteredThreads.length - idx} />
						) : (
							<ReplyCard replyid={thread.reply_id} idx={filteredThreads.length - idx} />
						)}
					</div>
				))}
			</div>
		</div>
	);
};

const ReplyCard: FC<{ replyid: ReplyID; idx: number }> = ({ replyid, idx }) => {
	// const [likes, views, replies, quotes, reposts] = useThreadInfo(thread);

	const thread = useReply(replyid);
	const thread_replies = useAllReplyReplies(replyid);

	const [engagement, reach, activity] = useReplyEngagementRate(replyid);

	if (!thread || !thread_replies) {
		return <div>loading...</div>;
	}

	const likes = thread.insights?.total_likes ?? 0;
	const views = thread.insights?.total_views ?? 0;
	const replyCount = thread_replies.length;
	const quotes = thread.insights?.total_quotes ?? 0;
	const reposts = thread.insights?.total_reposts ?? 0;

	return (
		<div className="bg-gray-50 backdrop-blur-xl bg-opacity-75 sm:p-6 p-4 rounded-3xl shadow-2xl m-1 max-w-xl  relative">
			<button
				onClick={() => {
					window.open(thread.media.permalink, "_blank");
				}}
				className="absolute shadow-sm inline-flex items-center gap-x-1.5 rounded-full bg-black px-3 py-2 text-xs font-medium text-white font-mono -top-4 right-1 hover:scale-115 transform transition duration-200 ease-in-out"
			>
				open in <img width={15} src="./threads-logo-white.svg"></img>
			</button>
			<div className="absolute shadow-sm inline-flex items-center gap-x-1.5 rounded-full bg-blue-400 px-3 py-2 text-xs font-medium text-white font-mono -top-4 left-1 hover:scale-115 transform transition duration-200 ease-in-out">
				reply
			</div>
			<div className="flex flex-wrap gap-2 mb-4">
				<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-800 font-mono">
					#{idx + 1}
				</span>
				<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-800 font-mono">
					{/* week day */}
					{new Date(thread.media.timestamp).toLocaleString("en-US", { weekday: "short" }).toUpperCase()}
				</span>
				<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-800 font-mono">
					{new Date(thread.media.timestamp).toLocaleDateString()}
				</span>
				<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-800 font-mono">
					{new Date(thread.media.timestamp).toLocaleTimeString()}
				</span>

				<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-800">
					{thread.media.media_type}
				</span>
				{likes > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-red-100 px-3 py-2 text-xs font-medium text-red-800">
						<svg className="h-3 w-3 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{thread.insights?.total_likes} likes
					</span>
				)}
				{views > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 px-3 py-2 text-xs font-medium text-blue-800">
						<svg className="h-3 w-3 fill-blue-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{views} views
					</span>
				)}

				{replyCount > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-orange-100 px-3 py-2 text-xs font-medium text-orange-800">
						<svg className="h-3 w-3 fill-orange-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{replyCount} replies
					</span>
				)}
				{quotes > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-purple-100 px-3 py-2 text-xs font-medium text-purple-800">
						<svg className="h-3 w-3 fill-purple-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{quotes} quotes
					</span>
				)}
				{reposts > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-3 py-2 text-xs font-medium text-yellow-800">
						<svg className="h-3 w-3 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{reposts} reposts
					</span>
				)}
				{engagement > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-3 py-2 text-xs font-medium text-green-800">
						<svg className="h-3 w-3 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{formatNumber(engagement)}x engagement
					</span>
				)}
				{reach > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-cyan-100 px-3 py-2 text-xs font-medium text-cyan-800">
						<svg className="h-3 w-3 fill-cyan-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{formatNumber(reach)}x reach
					</span>
				)}
				{activity > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-teal-100 px-3 py-2 text-xs font-medium text-teal-800">
						<svg className="h-3 w-3 fill-teal-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{formatNumber(activity)}x activity
					</span>
				)}
			</div>
			<p
				className="shadow-md sm:text-2xl text-lg font-mono text-gray-800 bg-slate-100 px-5 py-3 rounded-lg"
				style={{ whiteSpace: "pre-wrap" }}
			>
				{thread.media.text}
			</p>
			{thread.media.media_url && (
				<div className="px-5  pt-5 flex justify-center max-w-full">
					{(thread.media.media_type === "IMAGE" || thread.media.media_type === "CAROUSEL_ALBUM") && (
						<img src={thread.media.media_url} alt="Media" className="rounded-2xl  border-solid shadow-2xl" />
					)}
					{thread.media.media_type === "VIDEO" && (
						<video src={thread.media.media_url} controls className="rounded-2xl shadow-2xl" />
					)}
					{thread.media.media_type === "AUDIO" && (
						<audio src={thread.media.media_url} controls className="rounded-2xl shadow-2xl" />
					)}
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

const ThreadCard: FC<{ threadid: ThreadID; idx: number }> = ({ threadid, idx }) => {
	// const [likes, views, replies, quotes, reposts] = useThreadInfo(thread);

	const thread = useThread(threadid);
	const thread_replies = useAllThreadReplies(threadid);

	const [engagement, reach, activity] = useThreadEngagementRate(threadid);

	if (!thread || !thread_replies) {
		return <div>Loading...</div>;
	}

	const likes = thread.insights?.total_likes ?? 0;
	const views = thread.insights?.total_views ?? 0;
	const replyCount = thread_replies.length;
	const quotes = thread.insights?.total_quotes ?? 0;
	const reposts = thread.insights?.total_reposts ?? 0;

	return (
		<div className="bg-gray-50 backdrop-blur-xl bg-opacity-75 sm:p-6 p-4 rounded-3xl shadow-2xl m-1 max-w-xl  relative">
			<button
				onClick={() => {
					window.open(thread.media.permalink, "_blank");
				}}
				className="absolute shadow-sm inline-flex items-center gap-x-1.5 rounded-full bg-black px-3 py-2 text-xs font-medium text-white font-mono -top-4 right-1 hover:scale-115 transform transition duration-200 ease-in-out"
			>
				open in <img width={15} src="./threads-logo-white.svg"></img>
			</button>
			<div className="absolute shadow-sm inline-flex items-center gap-x-1.5 rounded-full bg-green-400 px-3 py-2 text-xs font-medium text-white font-mono -top-4 left-1 hover:scale-115 transform transition duration-200 ease-in-out">
				post
			</div>
			<div className="flex flex-wrap gap-2 mb-4">
				<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-800 font-mono">
					#{idx + 1}
				</span>
				<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-800 font-mono">
					{/* week day */}
					{new Date(thread.media.timestamp).toLocaleString("en-US", { weekday: "short" }).toUpperCase()}
				</span>
				<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-800 font-mono">
					{new Date(thread.media.timestamp).toLocaleDateString()}
				</span>
				<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-800 font-mono">
					{new Date(thread.media.timestamp).toLocaleTimeString()}
				</span>

				<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-800">
					{thread.media.media_type}
				</span>
				{likes > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-red-100 px-3 py-2 text-xs font-medium text-red-800">
						<svg className="h-3 w-3 fill-red-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{thread.insights?.total_likes} likes
					</span>
				)}
				{views > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-blue-100 px-3 py-2 text-xs font-medium text-blue-800">
						<svg className="h-3 w-3 fill-blue-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{views} views
					</span>
				)}

				{replyCount > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-orange-100 px-3 py-2 text-xs font-medium text-orange-800">
						<svg className="h-3 w-3 fill-orange-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{replyCount} replies
					</span>
				)}
				{quotes > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-purple-100 px-3 py-2 text-xs font-medium text-purple-800">
						<svg className="h-3 w-3 fill-purple-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{quotes} quotes
					</span>
				)}
				{reposts > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-3 py-2 text-xs font-medium text-yellow-800">
						<svg className="h-3 w-3 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{reposts} reposts
					</span>
				)}
				{engagement > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-green-100 px-3 py-2 text-xs font-medium text-green-800">
						<svg className="h-3 w-3 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{formatNumber(engagement)}x engagement
					</span>
				)}
				{reach > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-cyan-100 px-3 py-2 text-xs font-medium text-cyan-800">
						<svg className="h-3 w-3 fill-cyan-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{formatNumber(reach)}x reach
					</span>
				)}
				{activity > 0 && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-teal-100 px-3 py-2 text-xs font-medium text-teal-800">
						<svg className="h-3 w-3 fill-teal-500" viewBox="0 0 6 6" aria-hidden="true">
							<circle cx={3} cy={3} r={3} />
						</svg>
						{formatNumber(activity)}x activity
					</span>
				)}
				{thread.media.is_quote_post && (
					<span className="shadow-lg inline-flex items-center gap-x-1.5 rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-800">
						QUOTE
					</span>
				)}
			</div>
			<p
				className="shadow-md sm:text-2xl text-lg font-mono text-gray-800 bg-slate-100 px-5 py-3 rounded-lg"
				style={{ whiteSpace: "pre-wrap" }}
			>
				{thread.media.text}
			</p>
			{thread.media.media_url && (
				<div className="px-5  pt-5 flex justify-center max-w-full">
					{(thread.media.media_type === "IMAGE" || thread.media.media_type === "CAROUSEL_ALBUM") && (
						<img src={thread.media.media_url} alt="Media" className="rounded-2xl  border-solid shadow-2xl" />
					)}
					{thread.media.media_type === "VIDEO" && (
						<video src={thread.media.media_url} controls className="rounded-2xl shadow-2xl" />
					)}
					{thread.media.media_type === "AUDIO" && (
						<audio src={thread.media.media_url} controls className="rounded-2xl shadow-2xl" />
					)}
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
