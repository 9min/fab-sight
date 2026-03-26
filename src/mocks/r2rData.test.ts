import { describe, expect, it } from "vitest";
import { MOCK_LOTS_V3 } from "./mockLotsV3";
import { MOCK_PROCESS_RESULTS, MOCK_R2R_ADJUSTMENTS } from "./r2rData";

describe("MOCK_R2R_ADJUSTMENTS", () => {
	it("10개 Run에 대해 temperature/pressure 조정값이 존재한다", () => {
		const tempAdj = MOCK_R2R_ADJUSTMENTS.filter((a) => a.sensorKey === "temperature");
		const pressAdj = MOCK_R2R_ADJUSTMENTS.filter((a) => a.sensorKey === "pressure");
		expect(tempAdj).toHaveLength(10);
		expect(pressAdj).toHaveLength(10);
	});

	it("runNumber가 1~10 순차로 존재한다", () => {
		const tempAdj = MOCK_R2R_ADJUSTMENTS.filter((a) => a.sensorKey === "temperature");
		const runNumbers = tempAdj.map((a) => a.runNumber);
		expect(runNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	});

	it("각 조정값에 필수 필드가 존재한다", () => {
		for (const adj of MOCK_R2R_ADJUSTMENTS) {
			expect(adj.lotId).toBeTruthy();
			expect(adj.targetSetpoint).toBeDefined();
			expect(adj.actualMean).toBeDefined();
			expect(typeof adj.adjustment).toBe("number");
		}
	});

	it("drift 구간(Run #5~7)에서 temperature adjustment 절대값이 증가한다", () => {
		const tempAdj = MOCK_R2R_ADJUSTMENTS.filter((a) => a.sensorKey === "temperature");
		const run5 = Math.abs(tempAdj[4].adjustment);
		const run6 = Math.abs(tempAdj[5].adjustment);
		const run7 = Math.abs(tempAdj[6].adjustment);
		expect(run6).toBeGreaterThan(run5);
		expect(run7).toBeGreaterThan(run6);
	});
});

describe("MOCK_PROCESS_RESULTS", () => {
	it("CVD 챔버 10개 Run에 대해 결과가 존재한다", () => {
		expect(MOCK_PROCESS_RESULTS).toHaveLength(10);
	});

	it("각 결과에 필수 필드가 존재한다", () => {
		for (const result of MOCK_PROCESS_RESULTS) {
			expect(result.lotId).toBeTruthy();
			expect(result.filmThickness).toBeGreaterThan(0);
			expect(result.uniformity).toBeGreaterThan(0);
			expect(result.defectCount).toBeGreaterThanOrEqual(0);
		}
	});

	it("drift 구간(Run #5~7)에서 filmThickness가 정상 범위보다 높다", () => {
		const driftResults = MOCK_PROCESS_RESULTS.filter((r) => r.runNumber >= 5 && r.runNumber <= 7);
		for (const r of driftResults) {
			expect(r.filmThickness).toBeGreaterThan(1010);
		}
	});

	it("결과의 lotId가 MOCK_LOTS_V3에 존재한다", () => {
		const lotIds = new Set(MOCK_LOTS_V3.map((l) => l.lotId));
		for (const result of MOCK_PROCESS_RESULTS) {
			expect(lotIds.has(result.lotId)).toBe(true);
		}
	});
});
