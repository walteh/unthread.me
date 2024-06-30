import { FC } from "react";

// Update with the correct path
import client from "@src/client";
import ErrorMessage from "@src/components/ErrorMessage";
import Loader from "@src/components/Loader";

const UserProfileView: FC = () => {
	const [profile] = client.cache_store((state) => [state.user_profile]);

	if (!profile) return null;

	if (profile.is_loading) return <Loader />;
	if (profile.error) return <ErrorMessage message={profile.error} />;

	return (
		<div className=" container mx-auto p-6">
			<div className="glass card card-normal flex flex-col items-center ">
				<img
					src={profile.data?.threads_profile_picture_url}
					alt={`${profile.data?.username}'s profile`}
					className="w-24 h-24 rounded-full mb-4"
				/>
				<h1 className="text-2xl font-bold mb-2 font-mono">@{profile.data?.username}</h1>
				<p className="text-center text-gray-600 mb-4">{profile.data?.threads_biography}</p>
			</div>
		</div>
	);
};

export default UserProfileView;
