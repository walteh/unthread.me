export const generate_auth_start_url = (state?: string): URL => {
	const client_id = import.meta.env.VITE_UNTHREADME_THREADS_API_APP_ID as string;

	if (!client_id) {
		throw new Error("Client ID not found");
	}

	const current_host = window.location.origin;

	const authUrl = new URL("https://threads.net/oauth/authorize");
	authUrl.searchParams.append("client_id", client_id);
	authUrl.searchParams.append("redirect_uri", current_host);
	authUrl.searchParams.append("scope", "threads_basic,threads_read_replies,threads_manage_insights");
	authUrl.searchParams.append("response_type", "code");

	if (state) {
		authUrl.searchParams.append("state", state);
	}

	return authUrl;
};

export default generate_auth_start_url;
