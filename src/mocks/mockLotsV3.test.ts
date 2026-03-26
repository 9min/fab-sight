import { describe, expect, it } from "vitest";
import { MOCK_LOTS_V3, MOCK_LOT_SUMMARIES_V3 } from "./mockLotsV3";

describe("MOCK_LOTS_V3", () => {
	it("28개의 Lot이 생성된다 (CVD-A 10 + CVD-B 5 + CVD-C 3 + Etch-A 6 + Etch-B 4)", () => {
		expect(MOCK_LOTS_V3).toHaveLength(28);
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

	it("모든 Lot에 runNumber가 존재한다", () => {
		for (const lot of MOCK_LOTS_V3) {
			expect(lot.runNumber).toBeGreaterThanOrEqual(1);
		}
	});

	it("CVD-01 Chamber A에 연속 10개 Run이 존재한다", () => {
		const cvdChA = MOCK_LOTS_V3.filter((lot) => lot.chamberId === "cvd01-ch-a");
		expect(cvdChA).toHaveLength(10);
		const runNumbers = cvdChA.map((l) => l.runNumber).sort((a, b) => a - b);
		expect(runNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	});

	it("CVD-01 Chamber B에 5개 Run이 존재한다", () => {
		const lots = MOCK_LOTS_V3.filter((lot) => lot.chamberId === "cvd01-ch-b");
		expect(lots).toHaveLength(5);
	});

	it("CVD-01 Chamber C에 3개 Run이 존재한다", () => {
		const lots = MOCK_LOTS_V3.filter((lot) => lot.chamberId === "cvd01-ch-c");
		expect(lots).toHaveLength(3);
	});

	it("ETCH-01 Chamber A에 6개 Run이 존재한다", () => {
		const lots = MOCK_LOTS_V3.filter((lot) => lot.chamberId === "etch01-ch-a");
		expect(lots).toHaveLength(6);
	});

	it("ETCH-01 Chamber B에 4개 Run이 존재한다", () => {
		const lots = MOCK_LOTS_V3.filter((lot) => lot.chamberId === "etch01-ch-b");
		expect(lots).toHaveLength(4);
	});

	it("모든 장비/챔버 조합에 Lot 데이터가 존재한다", () => {
		const chamberIds = ["cvd01-ch-a", "cvd01-ch-b", "cvd01-ch-c", "etch01-ch-a", "etch01-ch-b"];
		for (const chamberId of chamberIds) {
			const lots = MOCK_LOTS_V3.filter((lot) => lot.chamberId === chamberId);
			expect(lots.length).toBeGreaterThan(0);
		}
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
