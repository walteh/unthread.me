import { expect, test } from "bun:test";

import { analyzeTrendWithLinearRegression } from "./ml";

test("should analyze trend and predict next value", () => {
	// Arrange
	const data = [
		77, 12, 1, 1, 12, 0, 46, 2, 29, 1, 0, 28, 2, 6, 131, 19, 1, 33, 3, 30, 3, 86, 93, 14, 51, 43, 68, 69, 46, 126, 3, 10, 1, 6, 82, 71,
		10, 92, 3,
	];

	// Act
	const result = analyzeTrendWithLinearRegression(data);

	// Assert
	expect(result.trend).toHaveLength(data.length);
	expect(result.nextValue).toBeGreaterThanOrEqual(0);
	expect(result.nextValue).toBeLessThanOrEqual(Math.max(...data) * 2);
});
