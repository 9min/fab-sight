import { describe, expect, it } from "vitest";
import { MOCK_LOTS_V3, MOCK_LOT_SUMMARIES_V3 } from "./mockLotsV3";

describe("MOCK_LOTS_V3", () => {
	it("4개의 Lot이 생성된다", () => {
		expect(MOCK_LOTS_V3).toHaveLength(4);
	});

	it("각 Lot에 wafers 배열이 존재하고 6개의 Wafer를 포함한다", () => {
		for (const lot of MOCK_LOTS_V3) {
			expect(lot.wafers).toBeDefined();
			expect(lot.wafers).toHaveLength(6);
		}
	});

	it("Golden Lot이 정확히 1개 존재한다", () => {
		const goldenLots = MOCK_LOTS_V3.filter((lot) => lot.isGoldenLot);
		expect(goldenLots).toHaveLength(1);
		expect(goldenLots[0].lotId).toBe("LOT-GOLDEN-001");
	});

	it("모든 Lot에 equipmentId와 chamberId가 존재한다", () => {
		for (const lot of MOCK_LOTS_V3) {
			expect(lot.equipmentId).toBeTruthy();
			expect(lot.chamberId).toBeTruthy();
		}
	});

	it("모든 Lot에 recipeId와 recipeName이 존재한다", () => {
		for (const lot of MOCK_LOTS_V3) {
			expect(lot.recipeId).toBeTruthy();
			expect(lot.recipeName).toBeTruthy();
		}
	});

	it("CVD Lot과 Etch Lot이 모두 포함된다", () => {
		const recipeNames = MOCK_LOTS_V3.map((lot) => lot.recipeName);
		expect(recipeNames).toContain("CVD-STANDARD");
		expect(recipeNames).toContain("ETCH-DEEP");
	});

	it("각 Wafer에 data 배열이 비어있지 않다", () => {
		for (const lot of MOCK_LOTS_V3) {
			for (const wafer of lot.wafers) {
				expect(wafer.data.length).toBeGreaterThan(0);
			}
		}
	});
});

describe("MOCK_LOT_SUMMARIES_V3", () => {
	it("MOCK_LOTS_V3와 같은 수의 요약 정보를 가진다", () => {
		expect(MOCK_LOT_SUMMARIES_V3).toHaveLength(MOCK_LOTS_V3.length);
	});

	it("각 요약에 필수 필드가 존재한다", () => {
		for (const summary of MOCK_LOT_SUMMARIES_V3) {
			expect(summary.lotId).toBeTruthy();
			expect(summary.recipeName).toBeTruthy();
			expect(summary.equipmentId).toBeTruthy();
			expect(summary.chamberId).toBeTruthy();
		}
	});
});
