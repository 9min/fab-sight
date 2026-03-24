import type { ProcessDataPoint } from "@/types/process";
import { describe, expect, it } from "vitest";
import { buildParameterTableData, buildRadarData, findClosestDataPoint } from "./drilldownUtils";

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
		isAnomaly: false,
		anomalyScore: 0.15,
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

describe("findClosestDataPoint", () => {
	it("정확히 일치하는 타임스탬프를 찾는다", () => {
		const result = findClosestDataPoint(mockData, "2024-01-01T00:00:01.000Z");
		expect(result).toBeDefined();
		expect(result?.temperature).toBe(510);
	});

	it("가장 가까운 타임스탬프를 찾는다", () => {
		const result = findClosestDataPoint(mockData, "2024-01-01T00:00:01.500Z");
		expect(result).toBeDefined();
		// 1초와 2초 사이 → 가까운 쪽
		expect(result?.timestamp).toBe("2024-01-01T00:00:01.000Z");
	});

	it("빈 배열이면 null을 반환한다", () => {
		const result = findClosestDataPoint([], "2024-01-01T00:00:00.000Z");
		expect(result).toBeNull();
	});

	it("범위 밖의 타임스탬프면 가장 가까운 끝 포인트를 반환한다", () => {
		const result = findClosestDataPoint(mockData, "2023-12-31T00:00:00.000Z");
		expect(result).toBeDefined();
		expect(result?.timestamp).toBe(mockData[0].timestamp);
	});
});

describe("buildRadarData", () => {
	it("3개 센서의 데이터를 반환한다", () => {
		const result = buildRadarData(mockData[0], mockData);
		expect(result).toHaveLength(3);
	});

	it("각 항목에 sensor, label, value, max가 있다", () => {
		const result = buildRadarData(mockData[0], mockData);
		for (const item of result) {
			expect(item.sensor).toBeDefined();
			expect(item.label).toBeDefined();
			expect(typeof item.value).toBe("number");
			expect(typeof item.max).toBe("number");
		}
	});

	it("max 값이 전체 데이터의 최대값 이상이다", () => {
		const result = buildRadarData(mockData[0], mockData);
		const tempItem = result.find((r) => r.sensor === "temperature");
		expect(tempItem).toBeDefined();
		expect(tempItem?.max).toBeGreaterThanOrEqual(600);
	});

	it("value가 해당 포인트의 센서 값과 일치한다", () => {
		const result = buildRadarData(mockData[2], mockData);
		const tempItem = result.find((r) => r.sensor === "temperature");
		expect(tempItem?.value).toBe(600);
	});
});

describe("buildParameterTableData", () => {
	it("3개 센서의 데이터를 반환한다", () => {
		const result = buildParameterTableData(mockData[0]);
		expect(result).toHaveLength(3);
	});

	it("각 항목에 sensor, label, value, unit, status가 있다", () => {
		const result = buildParameterTableData(mockData[0]);
		for (const item of result) {
			expect(item.sensor).toBeDefined();
			expect(item.label).toBeDefined();
			expect(typeof item.value).toBe("number");
			expect(item.unit).toBeDefined();
			expect(["normal", "anomaly"]).toContain(item.status);
		}
	});

	it("정상 포인트는 status가 normal이다", () => {
		const result = buildParameterTableData(mockData[0]);
		for (const item of result) {
			expect(item.status).toBe("normal");
		}
	});

	it("이상 포인트는 status가 anomaly이다", () => {
		const result = buildParameterTableData(mockData[2]);
		for (const item of result) {
			expect(item.status).toBe("anomaly");
		}
	});
});
