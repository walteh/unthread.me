import { IoLogoGithub } from "react-icons/io5";

import useChangelogStore from "@src/client/hooks/useChangelogStore";
import useUnseenChanges, { ChangeWithSeen } from "@src/client/hooks/useUnseenChanges";

import ThreadsButton from "./ThreadsButton";

const ChangeRow = ({ change }: { change: ChangeWithSeen }) => (
	<tr>
		<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
			{!change.seen ? (
				<svg className="h-3 w-3 inline fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
					<circle cx={3} cy={3} r={3} />
				</svg>
			) : null}
		</td>
		<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
			<button
				className="inline"
				onClick={() => {
					window.open(`https://github.com/walteh/unthread.me/commit/${change.commitHash}`, "_blank");
				}}
			>
				<IoLogoGithub />
			</button>
		</td>
		<td
			className={`p-4 border-t border-gray-200 dark:border-gray-700 text-center ${change.type === "bug" ? "text-red-500" : "text-green-500"}`}
		>
			{change.type}
		</td>
		<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">{change.date}</td>
		<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
			{change.reportedBy.map((username) => (
				<ThreadsButton key={username} prefix="" username={username} className="mr-2"></ThreadsButton>
			))}
		</td>
		<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
			{change.resolvedBy.map((username) => (
				<ThreadsButton key={username} prefix="" username={username} className="mr-2"></ThreadsButton>
			))}
		</td>

		<td className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">{change.description}</td>
	</tr>
);

const ChangesTable = () => {
	const changes = useUnseenChanges();

	const markAllChangesAsSeen = useChangelogStore((state) => state.markAllChangesAsSeen);

	return (
		<div className="sm:p-6 min-h-screen">
			<div className="overflow-x-auto flex flex-col justify-between m-auto">
				<button
					onClick={markAllChangesAsSeen}
					className="shadow-sm  m-auto my-4 items-center gap-x-1.5 rounded-full bg-black dark:bg-white dark:text-black px-2 py-1 text-xs font-medium text-white font-rounded hover:scale-115 transform transition duration-200 ease-in-out"
				>
					mark all as read
				</button>

				<table className="min-w-full bg-white bg-opacity-50 backdrop-blur-xl rounded-2xl">
					<thead>
						<tr>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">new</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">link</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">type</th>

							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">date</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">reported by</th>

							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">implemented by</th>
							<th className="p-4 border-b-2 border-gray-200 dark:border-gray-700">description</th>
						</tr>
					</thead>
					<tbody>
						{changes.map((change) => (
							<ChangeRow key={change.commitHash} change={change} />
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default ChangesTable;
