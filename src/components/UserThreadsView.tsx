import useUserThreads from "@src/hooks/useUserThreads";

const UserInsightsViews = () => {
	const [threads, isLoading, error] = useUserThreads();

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			{threads ? (
				<div>
					<h2>Threads</h2>
					<ul>
						{threads.map((thread) => (
							<li key={thread.id}>{thread.text}</li>
						))}
					</ul>
				</div>
			) : (
				<div>No threads data available</div>
			)}
		</div>
	);
};

export default UserInsightsViews;
