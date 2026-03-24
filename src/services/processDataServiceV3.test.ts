import { describe, expect, it } from "vitest";
import {
	getEquipmentList,
	getGoldenLotDataV3,
	getLotDataV3,
	getLotsByChamber,
	getWaferData,
} from "./processDataServiceV3";

describe("getLotDataV3", () => {
	it("존재하는 lotId로 Lot을 조회할 수 있다", () => {
		const lot = getLotDataV3("LOT-GOLDEN-001");
		expect(lot).toBeDefined();
		expect(lot?.lotId).toBe("LOT-GOLDEN-001");
	});

	it("존재하지 않는 lotId는 undefined를 반환한다", () => {
		expect(getLotDataV3("nonexistent")).toBeUndefined();
	});
});

describe("getWaferData", () => {
	it("Lot 내의 Wafer를 조회할 수 있다", () => {
		const wafer = getWaferData("LOT-GOLDEN-001", "WF-01");
		expect(wafer).toBeDefined();
		expect(wafer?.waferId).toBe("WF-01");
	});

	it("존재하지 않는 waferId는 undefined를 반환한다", () => {
		expect(getWaferData("LOT-GOLDEN-001", "nonexistent")).toBeUndefined();
	});
});

describe("getGoldenLotDataV3", () => {
	it("Golden Lot을 반환한다", () => {
		const golden = getGoldenLotDataV3();
		expect(golden).toBeDefined();
		expect(golden?.isGoldenLot).toBe(true);
	});
});

describe("getEquipmentList", () => {
	it("장비 목록을 반환한다", () => {
		const list = getEquipmentList();
		expect(list.length).toBeGreaterThan(0);
		expect(list[0].equipmentId).toBeTruthy();
	});
});

describe("getLotsByChamber", () => {
	it("해당 챔버의 Lot만 필터링한다", () => {
		const lots = getLotsByChamber("cvd01-ch-a");
		expect(lots.length).toBeGreaterThan(0);
		for (const lot of lots) {
			expect(lot.chamberId).toBe("cvd01-ch-a");
		}
	});

	it("존재하지 않는 chamberId는 빈 배열을 반환한다", () => {
		expect(getLotsByChamber("nonexistent")).toHaveLength(0);
	});
});
