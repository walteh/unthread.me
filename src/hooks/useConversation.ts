import ky from "ky";
import React from "react";

// Update with your actual store import
import { AccessTokenResponse, ConversationResponse, getConversation, GetConversationParams, Reply } from "@src/threadsapi/api"; // Update with your actual API import
import { usePersistantStore } from "@src/threadsapi/store";

const useConversation = (mediaId: string, params?: GetConversationParams) => {
	const [conversation, setConversation] = React.useState<Reply[] | null>(null);
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string | null>(null);
	const accessToken = usePersistantStore((state) => state.access_token);

	React.useEffect(() => {
		async function fetchConversation(token: AccessTokenResponse) {
			setIsLoading(true);
			try {
				const kyd = ky.create({ prefixUrl: "https://graph.threads.net" });
				const conversationResponse: ConversationResponse = await getConversation(kyd, token, mediaId, params);
				setConversation(conversationResponse.data);
				setError(null);
			} catch (error) {
				console.error("Error fetching conversation:", error);
				setError("Failed to fetch conversation");
			} finally {
				setIsLoading(false);
			}
		}

		if (accessToken && mediaId) {
			void fetchConversation(accessToken);
		}
	}, [accessToken, mediaId, params]);

	return [conversation, isLoading, error] as const;
};

export default useConversation;
