import { Change, changes } from "../changelog_store";
import useChangelogStore from "./useChangelogStore";

export interface ChangeWithSeen extends Change {
	seen: boolean;
}

const useUnseenChanges = () => {
	const lastSeenChange = useChangelogStore((state) => state.last_seen_change);

	return changes
		.map((change, index) => ({
			...change,
			seen: index < lastSeenChange,
		}))
		.reverse();
};

export default useUnseenChanges;
