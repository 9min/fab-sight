import { ANOMALY_HIGH_COLOR, ANOMALY_MEDIUM_COLOR } from "@/constants/chart";
import { createMockDataPoint } from "@/test/helpers";
import { describe, expect, it } from "vitest";
import { buildAnomalyOverlay } from "./buildAnomalyOverlay";

const mockData = [
	createMockDataPoint({ sensors: { temperature: 500, pressure: 5, rfPower: 1500 } }),
	createMockDataPoint({
		timestamp: "2024-03-01T10:00:01Z",
		sensors: { temperature: 510, pressure: 5.2, rfPower: 1520 },
		isAnomaly: true,
		anomalyScore: 0.65,
	}),
	createMockDataPoint({
		timestamp: "2024-03-01T10:00:02Z",
		sensors: { temperature: 600, pressure: 8, rfPower: 2500 },
		isAnomaly: true,
		anomalyScore: 0.9,
	}),
	createMockDataPoint({
		timestamp: "2024-03-01T10:00:03Z",
		sensors: { temperature: 505, pressure: 5.1, rfPower: 1510 },
	}),
];

describe("buildAnomalyOverlay", () => {
	it("show가 false이면 빈 배열을 반환한다", () => {
		expect(buildAnomalyOverlay(mockData, false, "temperature")).toEqual([]);
	});

	it("show가 true이면 시리즈를 반환한다", () => {
		const result = buildAnomalyOverlay(mockData, true, "temperature");
		expect(result.length).toBeGreaterThan(0);
	});

	it("이상치 scatter 시리즈가 포함된다", () => {
		const result = buildAnomalyOverlay(mockData, true, "temperature");
		const scatter = result.find((s) => (s as Record<string, unknown>).type === "scatter");
		expect(scatter).toBeDefined();
	});

	it("이상치 포인트만 scatter 데이터에 포함된다", () => {
		const result = buildAnomalyOverlay(mockData, true, "temperature");
		const scatter = result.find((s) => (s as Record<string, unknown>).type === "scatter") as Record<
			string,
			unknown
		>;
		expect(scatter.data as unknown[]).toHaveLength(2);
	});

	it("높은 이상치(>0.8)에 빨간 색상이 적용된다", () => {
		const result = buildAnomalyOverlay(mockData, true, "temperature");
		const scatter = result.find((s) => (s as Record<string, unknown>).type === "scatter") as Record<
			string,
			unknown
		>;
		const data = scatter.data as Array<Record<string, unknown>>;
		const highAnomaly = data.find(
			(d) => (d.itemStyle as Record<string, unknown>)?.color === ANOMALY_HIGH_COLOR,
		);
		expect(highAnomaly).toBeDefined();
	});

	it("중간 이상치(0.5~0.8)에 노란 색상이 적용된다", () => {
		const result = buildAnomalyOverlay(mockData, true, "temperature");
		const scatter = result.find((s) => (s as Record<string, unknown>).type === "scatter") as Record<
			string,
			unknown
		>;
		const data = scatter.data as Array<Record<string, unknown>>;
		const medAnomaly = data.find(
			(d) => (d.itemStyle as Record<string, unknown>)?.color === ANOMALY_MEDIUM_COLOR,
		);
		expect(medAnomaly).toBeDefined();
	});

	it("빈 데이터로도 동작한다", () => {
		expect(buildAnomalyOverlay([], true, "temperature")).toBeDefined();
	});

	it("이상치가 없는 데이터에서 scatter 데이터가 비어 있다", () => {
		const normalData = [createMockDataPoint()];
		const result = buildAnomalyOverlay(normalData, true, "temperature");
		const scatter = result.find((s) => (s as Record<string, unknown>).type === "scatter") as Record<
			string,
			unknown
		>;
		expect(scatter.data as unknown[]).toHaveLength(0);
	});
});
