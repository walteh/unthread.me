import { FC } from "react";

import useCacheStore from "@src/client/hooks/useCacheStore";

import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";

const StatusChecker: FC<{ data: { error: string | null; is_loading: boolean } | null }> = ({ data }) => {
	if (!data) return null;
	if (data.is_loading) return <Loader />;
	if (data.error) return <ErrorMessage message={data.error} />;
	return null;
};

const Status = () => {
	const profile = useCacheStore((state) => state.user_profile);
	const insights = useCacheStore((state) => state.user_insights);
	const threads = useCacheStore((state) => state.user_threads);
	const followerDemographics = useCacheStore((state) => state.user_follower_demographics);

	const threadReplies = useCacheStore((state) => state.user_threads_replies);
	const threadInsights = useCacheStore((state) => state.user_threads_insights);

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold text-center mb-8">Status</h1>
			<div className="space-y-6">
				<StatusChecker data={profile} />
				<StatusChecker data={insights} />
				<StatusChecker data={threads} />
				<StatusChecker data={followerDemographics} />
				<StatusChecker data={threadReplies} />
				<StatusChecker data={threadInsights} />
			</div>
		</div>
	);
};

export default Status;
