import type { Recipe } from "@/types/process";
import { describe, expect, it } from "vitest";
import { buildRecipeStepOverlay } from "./buildRecipeStepOverlay";

const mockRecipe: Recipe = {
	recipeId: "test-recipe",
	name: "TEST",
	processType: "CVD-PECVD",
	steps: [
		{ stepId: "s1", stepNumber: 1, name: "Pump Down", durationSec: 45, targetParams: {} },
		{ stepId: "s2", stepNumber: 2, name: "Stabilize", durationSec: 90, targetParams: {} },
		{ stepId: "s3", stepNumber: 3, name: "Deposition", durationSec: 300, targetParams: {} },
	],
};

describe("buildRecipeStepOverlay", () => {
	it("recipe가 없으면 빈 배열을 반환한다", () => {
		expect(buildRecipeStepOverlay(undefined, "wallClock")).toEqual([]);
	});

	it("recipe가 있으면 시리즈를 반환한다", () => {
		const result = buildRecipeStepOverlay(mockRecipe, "elapsed");
		expect(result).toHaveLength(1);
	});

	it("첫 스텝 경계는 제외하고 나머지 스텝 경계가 markLine에 포함된다", () => {
		const result = buildRecipeStepOverlay(mockRecipe, "elapsed");
		const series = result[0] as Record<string, unknown>;
		const markLine = series.markLine as Record<string, unknown>;
		const data = markLine.data as Array<Record<string, unknown>>;
		// 3 스텝 → 2개 경계 (스텝 2 시작, 스텝 3 시작)
		expect(data).toHaveLength(2);
	});

	it("elapsed 모드에서 경계 x값이 경과 시간이다", () => {
		const result = buildRecipeStepOverlay(mockRecipe, "elapsed");
		const series = result[0] as Record<string, unknown>;
		const markLine = series.markLine as Record<string, unknown>;
		const data = markLine.data as Array<Record<string, unknown>>;
		expect(data[0].xAxis).toBe(45); // 첫 번째 스텝 duration
		expect(data[1].xAxis).toBe(135); // 45 + 90
	});

	it("경계에 스텝 이름이 포함된다", () => {
		const result = buildRecipeStepOverlay(mockRecipe, "elapsed");
		const series = result[0] as Record<string, unknown>;
		const markLine = series.markLine as Record<string, unknown>;
		const data = markLine.data as Array<Record<string, unknown>>;
		expect(data[0].name).toBe("Stabilize");
		expect(data[1].name).toBe("Deposition");
	});
});
