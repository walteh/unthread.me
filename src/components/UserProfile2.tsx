import useCacheStore from "@src/client/hooks/useCacheStore";
import useThreadsListSortedByDate from "@src/client/hooks/useThreadsListByDate";
import useUserInsights from "@src/client/hooks/useUserInsights";

const formatNumber = (number: number) => {
	const formatter = Intl.NumberFormat("en", { notation: "compact" });
	return formatter.format(number);
};

export default function UserProfile2() {
	const [profile] = useCacheStore((state) => [state.user_profile]);
	const [insights] = useUserInsights();
	const [threads] = useThreadsListSortedByDate();

	const refresh = useCacheStore((state) => state.clearCache);

	const stats = [
		{ label: "Followers", value: formatNumber(insights.total_followers) },
		{ label: "Total Likes", value: formatNumber(insights.total_likes) },
		{ label: "Total Views", value: formatNumber(insights.total_views) },
		{ label: "Total Threads", value: formatNumber(threads.length) },
	];

	return (
		<div className="overflow-hidden rounded-xl bg-white shadow-lg">
			<h2 className="sr-only" id="profile-overview-title">
				Profile Overview
			</h2>
			<div className="bg-white p-6">
				<div className="sm:flex sm:items-center sm:justify-between">
					<div className="sm:flex sm:space-x-5">
						<div className="flex-shrink-0">
							<img className="mx-auto h-20 w-20 rounded-full" src={profile?.data?.threads_profile_picture_url} alt="" />
						</div>
						<div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
							<p className="text-sm font-medium text-gray-600">Welcome back,</p>
							<p className="text-xl font-bold font-rounded text-gray-900 sm:text-2xl">@{profile?.data?.username}</p>
							<p className="text-sm font-medium text-gray-600">{profile?.data?.threads_biography}</p>
						</div>
					</div>
					<div className="mt-5 flex justify-center sm:mt-0">
						<button
							onClick={refresh}
							className="flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
						>
							Reset Cache
						</button>
					</div>
				</div>
			</div>
			<div
				className={`grid grid-cols-1 divide-y divide-gray-200 border-t border-gray-200 bg-gray-50 sm:grid-cols-${stats.length} sm:divide-x sm:divide-y-0`}
			>
				{stats.map((stat) => (
					<div key={stat.label} className="px-6 py-5 text-center text-sm font-medium">
						<span className="text-gray-900">{stat.value}</span> <span className="text-gray-600">{stat.label}</span>
					</div>
				))}
			</div>
		</div>
	);
}
