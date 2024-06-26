import useUserInsights from "@src/hooks/useUserInsights";

const UserInsightsViews = () => {
	const [insights, isLoading, error] = useUserInsights("views", { all_time: true });

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			{insights ? (
				<div>
					{insights.data.map((metric) => (
						<div key={metric.id}>
							<h2>{metric.title}</h2>
							<p>{metric.description}</p>
							<ul>
								{metric.values.map((value, index) => (
									<li key={index}>
										{value.end_time ? `${value.end_time}: ` : ""}
										{value.value}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			) : (
				<div>No insights data available</div>
			)}
		</div>
	);
};

export default UserInsightsViews;
