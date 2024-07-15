import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import useFeatureFlagStore from "./useFeatureFlagStrore";

const useFeatureFlagUpdater = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const ff = useFeatureFlagStore((state) => state.enable_alpha_i_know_what_im_doing);
	const updateFF = useFeatureFlagStore((state) => state.updateEnableAlphaIKnowWhatImDoing);

	useEffect(() => {
		const f = searchParams.get("ff");

		if (f && f !== "") {
			if (f === "alpha") {
				updateFF(!ff);
				setSearchParams({});
			}
		}
	}, [searchParams, setSearchParams, ff, updateFF]);

	return null;
};

export default useFeatureFlagUpdater;
