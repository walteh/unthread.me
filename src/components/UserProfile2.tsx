import useCacheStore from "@src/client/hooks/useCacheStore";

const user = {
	name: "Rebecca Nicholas",
	role: "Product Designer",
	imageUrl:
		"https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const formatNumber = (number: number) => {
	const formatter = Intl.NumberFormat("en", { notation: "compact" });
	return formatter.format(number);
};

export default function UserProfile2() {
	const [profile] = useCacheStore((state) => [state.user_profile]);
	const [insights] = useCacheStore((state) => [state.user_insights]);
	const [threads] = useCacheStore((state) => [state.user_threads]);

	const refresh = useCacheStore((state) => state.clearCache);

	if (!profile?.data) return null;
	if (!insights?.data) return null;
	if (!threads?.data) return null;

	const stats = [
		{ label: "Followers", value: formatNumber(insights.data.followers_count?.total_value.value ?? 0) },
		{ label: "Total Likes", value: formatNumber(insights.data.likes?.total_value.value ?? 0) },
		{ label: "Total Views", value: formatNumber(insights.data.views?.values.reduce((acc, curr) => acc + curr.value, 0) ?? 0) },
		{ label: "Total Threads", value: formatNumber(threads.data.data.length) },
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
							<img className="mx-auto h-20 w-20 rounded-full" src={profile.data.threads_profile_picture_url} alt="" />
						</div>
						<div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
							<p className="text-sm font-medium text-gray-600">Welcome back,</p>
							<p className="text-xl font-bold font-rounded text-gray-900 sm:text-2xl">@{profile.data.username}</p>
							<p className="text-sm font-medium text-gray-600">{profile.data.threads_biography}</p>
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
