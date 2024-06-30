import { expect, test } from "bun:test";

import ky from "ky";

import exchange_code_for_short_lived_token from "./exchange_code_for_short_lived_token";

test("should return the access token", async () => {
	// Arrange

	const code = "your-code";
	const token = "your-access";

	const customFetch: typeof fetch = async (input) => {
		if (!(input instanceof Request)) {
			throw new TypeError("Expected to have input as request");
		}

		// sleep for 1 second
		await new Promise((resolve) => setTimeout(resolve, 1000));

		expect(input.url.includes(code)).toBe(true);

		return await Promise.resolve(new Response(JSON.stringify({ access_token: token, user_id: 1 })));
	};

	const inst = ky.create({
		prefixUrl: `https://localhost:3000`,
		fetch: customFetch,
	});

	const result = await exchange_code_for_short_lived_token(inst, "your-code");

	expect(result.access_token).toBe(token);
});

test("should throw an error when fetching access token fails", () => {
	// Arrange

	const errorMessage = "Failed to fetch access token";

	const customFetch: typeof fetch = async () => {
		return await Promise.reject(new Error(errorMessage));
	};

	const inst = ky.create({
		prefixUrl: `https://localhost:3000`,
		fetch: customFetch,
	});

	// Act and Assert
	expect(exchange_code_for_short_lived_token(inst, "yo")).rejects.toThrow(errorMessage);
});
