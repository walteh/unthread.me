import { FC } from "react";
import { TagCloud } from "react-tagcloud";

import ErrorMessage from "@src/components/ErrorMessage";
import Loader from "@src/components/Loader";
import useTimePeriod, { useTimePeriodFilteredData } from "@src/hooks/useTimePeriod";
import { useByWord } from "@src/hooks/useWords";
import { ThreadMedia } from "@src/threadsapi/api";
// Update with the correct path
import { useUserDataStore } from "@src/threadsapi/store";

const UserWordCloudView: FC = () => {
	const [threads] = useUserDataStore((state) => [state.user_threads]);

	if (!threads) return null;

	if (threads.is_loading) return <Loader />;
	if (threads.error) return <ErrorMessage message={threads.error} />;

	if (!threads.data) return <ErrorMessage message="No threads data available" />;

	return (
		<div className="container mx-auto p-6">
			<div className=" card card-normal flex flex-col items-center">
				<Cloud data={threads.data.data} />
			</div>
		</div>
	);
};

const Cloud: FC<{
	data: ThreadMedia[];
}> = ({ data }) => {
	const [timePeriod] = useTimePeriod();

	const filteredData = useTimePeriodFilteredData(data, (thread) => thread.timestamp, timePeriod);

	const words = useByWord(filteredData);

	console.log({ words });

	return (
		<>
			<TagCloud
				minSize={23}
				maxSize={50}
				tags={words
					.filter((x) => x.type === "abbreviations")
					.map((word) => ({ value: word.word, count: word.total_views, key: word.word }))}
				onClick={(tag) => {
					alert(`'${tag.value}' was selected!`);
				}}
			/>
			<TagCloud
				minSize={23}
				maxSize={50}
				tags={words
					.filter((x) => x.type === "emoji")
					.map((word) => ({ value: word.word, count: word.total_views, key: word.word }))}
				onClick={(tag) => {
					alert(`'${tag.value}' was selected!`);
				}}
			/>{" "}
			<TagCloud
				minSize={23}
				maxSize={50}
				tags={words
					.filter((x) => x.type === "numbers")
					.map((word) => ({ value: word.word, count: word.total_views, key: word.word }))}
				onClick={(tag) => {
					alert(`'${tag.value}' was selected!`);
				}}
			/>
			<TagCloud
				minSize={23}
				maxSize={50}
				tags={words
					.filter((x) => x.type === "atMentions")
					.map((word) => ({ value: word.word, count: word.total_views, key: word.word }))}
				onClick={(tag) => {
					alert(`'${tag.value}' was selected!`);
				}}
			/>
			<TagCloud
				minSize={23}
				maxSize={50}
				tags={words
					.filter((x) => x.type === "hashTags")
					.map((word) => ({ value: word.word, count: word.total_views, key: word.word }))}
				onClick={(tag) => {
					alert(`'${tag.value}' was selected!`);
				}}
			/>
		</>
	);
};

export default UserWordCloudView;
