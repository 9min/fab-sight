import { ANOMALY_HIGH_COLOR, ANOMALY_MEDIUM_COLOR } from "@/constants/chart";
import type { ProcessDataPoint } from "@/types/process";
import { describe, expect, it } from "vitest";
import { buildAnomalyOverlay } from "./buildAnomalyOverlay";

const mockData: ProcessDataPoint[] = [
	{
		timestamp: "2024-01-01T00:00:00.000Z",
		temperature: 500,
		pressure: 5,
		rfPower: 1500,
		isAnomaly: false,
		anomalyScore: 0.1,
	},
	{
		timestamp: "2024-01-01T00:00:01.000Z",
		temperature: 510,
		pressure: 5.2,
		rfPower: 1520,
		isAnomaly: true,
		anomalyScore: 0.65,
	},
	{
		timestamp: "2024-01-01T00:00:02.000Z",
		temperature: 600,
		pressure: 8,
		rfPower: 2500,
		isAnomaly: true,
		anomalyScore: 0.9,
	},
	{
		timestamp: "2024-01-01T00:00:03.000Z",
		temperature: 505,
		pressure: 5.1,
		rfPower: 1510,
		isAnomaly: false,
		anomalyScore: 0.2,
	},
];

describe("buildAnomalyOverlay", () => {
	it("show가 false이면 빈 배열을 반환한다", () => {
		const result = buildAnomalyOverlay(mockData, false);
		expect(result).toEqual([]);
	});

	it("show가 true이면 시리즈를 반환한다", () => {
		const result = buildAnomalyOverlay(mockData, true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("이상치 scatter 시리즈가 포함된다", () => {
		const result = buildAnomalyOverlay(mockData, true);
		const scatterSeries = result.find((s) => (s as Record<string, unknown>).type === "scatter");
		expect(scatterSeries).toBeDefined();
	});

	it("이상치 포인트만 scatter 데이터에 포함된다", () => {
		const result = buildAnomalyOverlay(mockData, true);
		const scatterSeries = result.find(
			(s) => (s as Record<string, unknown>).type === "scatter",
		) as Record<string, unknown>;
		const data = scatterSeries.data as unknown[];
		expect(data).toHaveLength(2);
	});

	it("높은 이상치(>0.8)에 빨간 색상이 적용된다", () => {
		const result = buildAnomalyOverlay(mockData, true);
		const scatterSeries = result.find(
			(s) => (s as Record<string, unknown>).type === "scatter",
		) as Record<string, unknown>;
		const data = scatterSeries.data as Array<Record<string, unknown>>;

		const highAnomaly = data.find((d) => {
			const style = d.itemStyle as Record<string, unknown> | undefined;
			return style?.color === ANOMALY_HIGH_COLOR;
		});
		expect(highAnomaly).toBeDefined();
	});

	it("중간 이상치(0.5~0.8)에 노란 색상이 적용된다", () => {
		const result = buildAnomalyOverlay(mockData, true);
		const scatterSeries = result.find(
			(s) => (s as Record<string, unknown>).type === "scatter",
		) as Record<string, unknown>;
		const data = scatterSeries.data as Array<Record<string, unknown>>;

		const mediumAnomaly = data.find((d) => {
			const style = d.itemStyle as Record<string, unknown> | undefined;
			return style?.color === ANOMALY_MEDIUM_COLOR;
		});
		expect(mediumAnomaly).toBeDefined();
	});

	it("빈 데이터로도 동작한다", () => {
		const result = buildAnomalyOverlay([], true);
		expect(result).toBeDefined();
	});

	it("이상치가 없는 데이터에서 scatter 데이터가 비어 있다", () => {
		const normalData: ProcessDataPoint[] = [
			{
				timestamp: "2024-01-01T00:00:00.000Z",
				temperature: 500,
				pressure: 5,
				rfPower: 1500,
				isAnomaly: false,
				anomalyScore: 0.1,
			},
		];
		const result = buildAnomalyOverlay(normalData, true);
		const scatterSeries = result.find(
			(s) => (s as Record<string, unknown>).type === "scatter",
		) as Record<string, unknown>;
		const data = scatterSeries.data as unknown[];
		expect(data).toHaveLength(0);
	});
});
