import { describe, expect, it } from "vitest";
import { MOCK_LOTS_V3 } from "./mockLotsV3";
import { MOCK_PROCESS_RESULTS, MOCK_R2R_ADJUSTMENTS } from "./r2rData";

describe("MOCK_R2R_ADJUSTMENTS", () => {
	it("CVD-01 Chamber A에 10개 Run × 2센서 = 20개 조정값이 존재한다", () => {
		const cvdA = MOCK_R2R_ADJUSTMENTS.filter(
			(a) => a.lotId.startsWith("LOT-GOLDEN") || a.lotId.startsWith("LOT-2024030"),
		);
		expect(cvdA).toHaveLength(20);
	});

	it("CVD-01 Chamber B에 5개 Run × 2센서 = 10개 조정값이 존재한다", () => {
		const cvdB = MOCK_R2R_ADJUSTMENTS.filter((a) => a.lotId.startsWith("LOT-CVD-B-"));
		expect(cvdB).toHaveLength(10);
	});

	it("CVD-01 Chamber C에 3개 Run × 2센서 = 6개 조정값이 존재한다", () => {
		const cvdC = MOCK_R2R_ADJUSTMENTS.filter((a) => a.lotId.startsWith("LOT-CVD-C-"));
		expect(cvdC).toHaveLength(6);
	});

	it("ETCH-01 Chamber A에 6개 Run × 2센서 = 12개 조정값이 존재한다", () => {
		const etchA = MOCK_R2R_ADJUSTMENTS.filter((a) => a.lotId.startsWith("LOT-ETCH-00"));
		expect(etchA).toHaveLength(12);
	});

	it("ETCH-01 Chamber B에 4개 Run × 2센서 = 8개 조정값이 존재한다", () => {
		const etchB = MOCK_R2R_ADJUSTMENTS.filter((a) => a.lotId.startsWith("LOT-ETCH-B-"));
		expect(etchB).toHaveLength(8);
	});

	it("각 조정값에 필수 필드가 존재한다", () => {
		for (const adj of MOCK_R2R_ADJUSTMENTS) {
			expect(adj.lotId).toBeTruthy();
			expect(adj.targetSetpoint).toBeDefined();
			expect(adj.actualMean).toBeDefined();
			expect(typeof adj.adjustment).toBe("number");
		}
	});

	it("CVD-A drift 구간(Run #5~7)에서 temperature adjustment 절대값이 증가한다", () => {
		const tempAdj = MOCK_R2R_ADJUSTMENTS.filter(
			(a) =>
				a.sensorKey === "temperature" &&
				(a.lotId.startsWith("LOT-GOLDEN") || a.lotId.startsWith("LOT-2024030")),
		);
		const run5 = Math.abs(tempAdj[4].adjustment);
		const run6 = Math.abs(tempAdj[5].adjustment);
		const run7 = Math.abs(tempAdj[6].adjustment);
		expect(run6).toBeGreaterThan(run5);
		expect(run7).toBeGreaterThan(run6);
	});

	it("ETCH-A spike 구간(Run #3)에서 pressure adjustment 절대값이 가장 크다", () => {
		const pressAdj = MOCK_R2R_ADJUSTMENTS.filter(
			(a) => a.sensorKey === "pressure" && a.lotId.startsWith("LOT-ETCH-00"),
		);
		const run3Adj = Math.abs(pressAdj[2].adjustment);
		for (let i = 0; i < pressAdj.length; i++) {
			if (i !== 2) {
				expect(run3Adj).toBeGreaterThan(Math.abs(pressAdj[i].adjustment));
			}
		}
	});

	it("Etch 챔버 조정값은 escTemperature와 pressure 센서를 사용한다", () => {
		const etchAdj = MOCK_R2R_ADJUSTMENTS.filter((a) => a.lotId.startsWith("LOT-ETCH"));
		const sensorKeys = new Set(etchAdj.map((a) => a.sensorKey));
		expect(sensorKeys.has("escTemperature")).toBe(true);
		expect(sensorKeys.has("pressure")).toBe(true);
		expect(sensorKeys.has("temperature")).toBe(false);
	});
});

describe("MOCK_PROCESS_RESULTS", () => {
	it("모든 챔버의 Lot에 대해 결과가 존재한다", () => {
		// CVD-A 10 + CVD-B 5 + CVD-C 3 + ETCH-A 6 + ETCH-B 4 = 28
		expect(MOCK_PROCESS_RESULTS).toHaveLength(28);
	});

	it("각 결과에 필수 필드가 존재한다", () => {
		for (const result of MOCK_PROCESS_RESULTS) {
			expect(result.lotId).toBeTruthy();
			expect(result.filmThickness).toBeGreaterThan(0);
			expect(result.uniformity).toBeGreaterThan(0);
			expect(result.defectCount).toBeGreaterThanOrEqual(0);
		}
	});

	it("CVD-A drift 구간(Run #5~7)에서 filmThickness가 정상 범위보다 높다", () => {
		const cvdAResults = MOCK_PROCESS_RESULTS.filter(
			(r) => r.lotId.startsWith("LOT-GOLDEN") || r.lotId.startsWith("LOT-2024030"),
		);
		const driftResults = cvdAResults.filter((r) => r.runNumber >= 5 && r.runNumber <= 7);
		for (const r of driftResults) {
			expect(r.filmThickness).toBeGreaterThan(1010);
		}
	});

	it("ETCH-A spike 구간(Run #3)에서 defectCount가 가장 높다", () => {
		const etchAResults = MOCK_PROCESS_RESULTS.filter((r) => r.lotId.startsWith("LOT-ETCH-00"));
		const run3 = etchAResults.find((r) => r.runNumber === 3);
		expect(run3).toBeDefined();
		expect(run3?.defectCount).toBeGreaterThan(20);
	});

	it("결과의 lotId가 MOCK_LOTS_V3에 존재한다", () => {
		const lotIds = new Set(MOCK_LOTS_V3.map((l) => l.lotId));
		for (const result of MOCK_PROCESS_RESULTS) {
			expect(lotIds.has(result.lotId)).toBe(true);
		}
	});

	it("CVD 공정은 filmThickness ~1000Å 범위, Etch 공정은 ~150nm 범위다", () => {
		const cvdResults = MOCK_PROCESS_RESULTS.filter(
			(r) =>
				r.lotId.includes("CVD") ||
				r.lotId.startsWith("LOT-GOLDEN") ||
				r.lotId.startsWith("LOT-2024030"),
		);
		const etchResults = MOCK_PROCESS_RESULTS.filter((r) => r.lotId.startsWith("LOT-ETCH"));

		for (const r of cvdResults) {
			expect(r.filmThickness).toBeGreaterThan(900);
			expect(r.filmThickness).toBeLessThan(1100);
		}
		for (const r of etchResults) {
			expect(r.filmThickness).toBeGreaterThan(100);
			expect(r.filmThickness).toBeLessThan(200);
		}
	});
});
