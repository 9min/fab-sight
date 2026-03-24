import { describe, expect, it } from "vitest";
import { getGoldenLotData, getLotData } from "./processDataService";

describe("getLotData", () => {
	it("존재하는 lotId로 조회하면 데이터를 반환한다", () => {
		const result = getLotData("LOT-GOLDEN-001");
		expect(result).toBeDefined();
		expect(result?.lotId).toBe("LOT-GOLDEN-001");
	});

	it("존재하지 않는 lotId로 조회하면 undefined를 반환한다", () => {
		const result = getLotData("NON-EXISTENT");
		expect(result).toBeUndefined();
	});

	it("반환된 Lot에 wafers 배열이 존재한다", () => {
		const result = getLotData("LOT-GOLDEN-001");
		expect(result?.wafers).toBeDefined();
		expect(result?.wafers.length).toBeGreaterThan(0);
	});
});

describe("getGoldenLotData", () => {
	it("Golden Lot 데이터를 반환한다", () => {
		const result = getGoldenLotData();
		expect(result).toBeDefined();
		expect(result?.isGoldenLot).toBe(true);
	});
});
