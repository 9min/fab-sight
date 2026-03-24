import { describe, expect, it } from "vitest";
import { MOCK_LOTS, MOCK_LOT_SUMMARIES } from "./mockLots";

describe("MOCK_LOTS", () => {
	it("3개 이상의 Lot이 존재한다", () => {
		expect(MOCK_LOTS.length).toBeGreaterThanOrEqual(3);
	});

	it("각 Lot에 10000개 이상의 데이터 포인트가 있다", () => {
		for (const lot of MOCK_LOTS) {
			expect(lot.data.length).toBeGreaterThanOrEqual(10000);
		}
	});

	it("Golden Lot이 존재한다", () => {
		const goldenLot = MOCK_LOTS.find((lot) => lot.lotId.includes("GOLDEN"));
		expect(goldenLot).toBeDefined();
	});

	it("각 Lot에 필수 필드가 존재한다", () => {
		for (const lot of MOCK_LOTS) {
			expect(lot.lotId).toBeTruthy();
			expect(lot.waferId).toBeTruthy();
			expect(lot.recipeName).toBeTruthy();
			expect(lot.startTime).toBeTruthy();
			expect(lot.endTime).toBeTruthy();
		}
	});
});

describe("MOCK_LOT_SUMMARIES", () => {
	it("MOCK_LOTS와 동일한 수의 요약이 존재한다", () => {
		expect(MOCK_LOT_SUMMARIES).toHaveLength(MOCK_LOTS.length);
	});

	it("각 요약에 lotId, waferId, recipeName이 있다", () => {
		for (const summary of MOCK_LOT_SUMMARIES) {
			expect(summary.lotId).toBeTruthy();
			expect(summary.waferId).toBeTruthy();
			expect(summary.recipeName).toBeTruthy();
		}
	});

	it("MOCK_LOTS의 lotId와 일치한다", () => {
		const lotIds = MOCK_LOTS.map((lot) => lot.lotId);
		const summaryIds = MOCK_LOT_SUMMARIES.map((s) => s.lotId);
		expect(summaryIds).toEqual(lotIds);
	});
});
