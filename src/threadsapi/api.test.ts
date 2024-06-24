import { fetchAccessToken, refreshAccessToken } from "./api";

import ky from "ky";

import { expect, test } from "bun:test";

test("should return the access token", async () => {
	// Arrange
	const secret = "your-client-secret";
	const token = "your-access-token";
	const newAccessToken = "your-new-access-token";

	const customFetch: typeof fetch = async (input) => {
		if (!(input instanceof Request)) {
			throw new TypeError("Expected to have input as request");
		}

		const url = new URL(input.url);

		expect(url.searchParams.get("grant_type")).toBe("th_exchange_token");
		expect(url.searchParams.get("client_secret")).toBe(secret);
		expect(url.searchParams.get("access_token")).toBe(token);

		return await Promise.resolve(new Response(JSON.stringify({ access_token: newAccessToken })));
	};

	const inst = ky.create({
		prefixUrl: `https://localhost:3000`,
		fetch: customFetch,
	});

	const result = await fetchAccessToken(inst, secret, token);

	expect(result).toBe(newAccessToken);
});

test("should throw an error when fetching access token fails", () => {
	// Arrange
	const secret = "your-client-secret";
	const token = "your-access-token";
	const errorMessage = "Failed to fetch access token";

	const customFetch: typeof fetch = async () => {
		return await Promise.reject(new Error(errorMessage));
	};

	const inst = ky.create({
		prefixUrl: `https://localhost:3000`,
		fetch: customFetch,
	});

	// Act and Assert
	expect(fetchAccessToken(inst, secret, token)).rejects.toThrow(errorMessage);
});

test("should return the refreshed access token", async () => {
	// Arrange
	const token = "your-access-token";
	const newAccessToken = "your-new-access-token";
	const customFetch: typeof fetch = async (input) => {
		if (!(input instanceof Request)) {
			throw new TypeError("Expected to have input as request");
		}
		const url = new URL(input.url);
		expect(url.searchParams.get("grant_type")).toBe("th_refresh_token");
		expect(url.searchParams.get("access_token")).toBe(token);
		return await Promise.resolve(new Response(JSON.stringify({ access_token: newAccessToken })));
	};
	const inst = ky.create({
		prefixUrl: `https://localhost:3000`,
		fetch: customFetch,
	});

	// Act
	const result = await refreshAccessToken(inst, token);

	// Assert
	expect(result).toBe(newAccessToken);
});

test("should throw an error when refreshing access token fails", () => {
	// Arrange
	const token = "your-access-token";
	const errorMessage = "Failed to refresh access token";
	const customFetch: typeof fetch = async () => {
		return await Promise.reject(new Error(errorMessage));
	};
	const inst = ky.create({
		prefixUrl: `https://localhost:3000`,
		fetch: customFetch,
	});

	// Act and Assert
	expect(refreshAccessToken(inst, token)).rejects.toThrow(errorMessage);
});
