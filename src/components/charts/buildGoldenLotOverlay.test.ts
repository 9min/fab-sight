import { GOLDEN_LOT_COLOR } from "@/constants/chart";
import type { ProcessDataPoint, SensorType } from "@/types/process";
import { describe, expect, it } from "vitest";
import { buildGoldenLotOverlay } from "./buildGoldenLotOverlay";

const mockGoldenData: ProcessDataPoint[] = [
	{
		timestamp: "2024-01-01T00:00:00.000Z",
		temperature: 500,
		pressure: 5,
		rfPower: 1500,
		isAnomaly: false,
		anomalyScore: 0.05,
	},
	{
		timestamp: "2024-01-01T00:00:01.000Z",
		temperature: 502,
		pressure: 5.1,
		rfPower: 1510,
		isAnomaly: false,
		anomalyScore: 0.03,
	},
	{
		timestamp: "2024-01-01T00:00:02.000Z",
		temperature: 501,
		pressure: 5.05,
		rfPower: 1505,
		isAnomaly: false,
		anomalyScore: 0.04,
	},
];

describe("buildGoldenLotOverlay", () => {
	it("show가 false이면 빈 배열을 반환한다", () => {
		const sensors: SensorType[] = ["temperature", "pressure"];
		const result = buildGoldenLotOverlay(mockGoldenData, sensors, false);
		expect(result).toEqual([]);
	});

	it("show가 true이면 선택된 센서 수만큼 시리즈를 생성한다", () => {
		const sensors: SensorType[] = ["temperature", "pressure", "rfPower"];
		const result = buildGoldenLotOverlay(mockGoldenData, sensors, true);
		expect(result).toHaveLength(3);
	});

	it("하나의 센서만 선택하면 시리즈 1개를 생성한다", () => {
		const sensors: SensorType[] = ["temperature"];
		const result = buildGoldenLotOverlay(mockGoldenData, sensors, true);
		expect(result).toHaveLength(1);
	});

	it("각 시리즈의 lineStyle이 dashed이다", () => {
		const sensors: SensorType[] = ["temperature"];
		const result = buildGoldenLotOverlay(mockGoldenData, sensors, true);
		const series = result[0] as Record<string, unknown>;
		const lineStyle = series.lineStyle as Record<string, unknown>;
		expect(lineStyle.type).toBe("dashed");
	});

	it("각 시리즈의 색상이 GOLDEN_LOT_COLOR이다", () => {
		const sensors: SensorType[] = ["temperature"];
		const result = buildGoldenLotOverlay(mockGoldenData, sensors, true);
		const series = result[0] as Record<string, unknown>;
		const lineStyle = series.lineStyle as Record<string, unknown>;
		expect(lineStyle.color).toBe(GOLDEN_LOT_COLOR);
	});

	it("시리즈 이름에 Golden 접두어가 있다", () => {
		const sensors: SensorType[] = ["temperature"];
		const result = buildGoldenLotOverlay(mockGoldenData, sensors, true);
		const series = result[0] as Record<string, unknown>;
		expect((series.name as string).startsWith("Golden")).toBe(true);
	});

	it("yAxisIndex가 센서 순서와 일치한다", () => {
		const sensors: SensorType[] = ["temperature", "pressure", "rfPower"];
		const result = buildGoldenLotOverlay(mockGoldenData, sensors, true);
		for (let i = 0; i < result.length; i++) {
			const series = result[i] as Record<string, unknown>;
			expect(series.yAxisIndex).toBe(i);
		}
	});

	it("빈 데이터로도 동작한다", () => {
		const sensors: SensorType[] = ["temperature"];
		const result = buildGoldenLotOverlay([], sensors, true);
		expect(result).toHaveLength(1);
	});
});
