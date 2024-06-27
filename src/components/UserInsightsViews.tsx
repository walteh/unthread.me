import { FC } from "react";

import ErrorMessage from "@src/components/ErrorMessage";
import Loader from "@src/components/Loader";
// Update with the correct path
import { useUserDataStore } from "@src/threadsapi/store";

const UserInsightsViews: FC = () => {
	const data = useUserDataStore((state) => state.user_insights_profile_views);

	if (!data) return null;

	if (data.is_loading) return <Loader />;
	if (data.error) return <ErrorMessage message={data.error} />;

	return (
		<div>
			{data.data ? (
				<div>
					{data.data.data.map((metric) => (
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
