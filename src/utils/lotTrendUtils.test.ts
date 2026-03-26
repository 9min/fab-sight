import { getSensorsForProcess } from "@/constants/sensorConfig";
import { generateWaferRuns } from "@/mocks/generateProcessDataV3";
import { RECIPE_CVD_STANDARD } from "@/mocks/recipes";
import type { LotDataV3 } from "@/types/fab";
import { describe, expect, it } from "vitest";
import {
	buildLotTrendData,
	calculateLotStepMean,
	calculateStepMean,
	calculateTrendStats,
} from "./lotTrendUtils";

const cvdSensors = getSensorsForProcess("CVD-PECVD");

function createTestLot(runNumber: number, anomalyRatio = 0): LotDataV3 {
	const wafers = generateWaferRuns({
		recipe: RECIPE_CVD_STANDARD,
		sensorsMeta: cvdSensors,
		waferCount: 2,
		anomalyRatio,
		waferVariation: 0,
	});
	return {
		lotId: `TEST-LOT-${runNumber}`,
		recipeId: "recipe-cvd-standard",
		recipeName: "CVD-STANDARD",
		equipmentId: "equip-cvd-01",
		chamberId: "cvd01-ch-a",
		isGoldenLot: false,
		waferCount: 2,
		wafers,
		runNumber,
	};
}

describe("calculateStepMean", () => {
	it("Deposition 스텝의 temperature 평균이 target(400°C) 근처다", () => {
		const lot = createTestLot(1);
		const mean = calculateStepMean(lot.wafers[0], "cvd-std-s3", "temperature");
		expect(mean).toBeGreaterThan(390);
		expect(mean).toBeLessThan(410);
	});

	it("존재하지 않는 stepId는 0을 반환한다", () => {
		const lot = createTestLot(1);
		const mean = calculateStepMean(lot.wafers[0], "nonexistent", "temperature");
		expect(mean).toBe(0);
	});
});

describe("calculateLotStepMean", () => {
	it("Lot 전체 Wafer의 평균이 단일 Wafer와 유사하다", () => {
		const lot = createTestLot(1);
		const lotMean = calculateLotStepMean(lot, "cvd-std-s3", "temperature");
		const waferMean = calculateStepMean(lot.wafers[0], "cvd-std-s3", "temperature");
		expect(Math.abs(lotMean - waferMean)).toBeLessThan(5);
	});
});

describe("buildLotTrendData", () => {
	it("runNumber 순서로 정렬된 트렌드 데이터를 반환한다", () => {
		const lots = [createTestLot(3), createTestLot(1), createTestLot(2)];
		const trend = buildLotTrendData(lots, "cvd-std-s3", "temperature");
		expect(trend).toHaveLength(3);
		expect(trend[0].runNumber).toBe(1);
		expect(trend[1].runNumber).toBe(2);
		expect(trend[2].runNumber).toBe(3);
	});

	it("각 포인트에 mean/min/max가 포함된다", () => {
		const lots = [createTestLot(1)];
		const trend = buildLotTrendData(lots, "cvd-std-s3", "temperature");
		expect(trend[0].mean).toBeDefined();
		expect(trend[0].min).toBeDefined();
		expect(trend[0].max).toBeDefined();
	});
});

describe("calculateTrendStats", () => {
	it("grand mean과 sigma를 계산한다", () => {
		const points = [
			{ runNumber: 1, lotId: "A", mean: 400, min: 399, max: 401 },
			{ runNumber: 2, lotId: "B", mean: 402, min: 401, max: 403 },
			{ runNumber: 3, lotId: "C", mean: 398, min: 397, max: 399 },
		];
		const stats = calculateTrendStats(points);
		expect(stats.grandMean).toBeCloseTo(400, 0);
		expect(stats.sigma).toBeGreaterThan(0);
	});

	it("빈 배열은 0을 반환한다", () => {
		const stats = calculateTrendStats([]);
		expect(stats.grandMean).toBe(0);
		expect(stats.sigma).toBe(0);
	});
});
