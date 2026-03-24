import { MOCK_SENSORS_META, createMockDataPoint } from "@/test/helpers";
import { describe, expect, it } from "vitest";
import { buildParameterTableData, buildRadarData, findClosestDataPoint } from "./drilldownUtils";

const mockData = [
	createMockDataPoint({
		timestamp: "2024-01-01T00:00:00.000Z",
		elapsedSec: 0,
		sensors: { temperature: 500, pressure: 5, rfPower: 1500 },
	}),
	createMockDataPoint({
		timestamp: "2024-01-01T00:00:01.000Z",
		elapsedSec: 1,
		sensors: { temperature: 510, pressure: 5.2, rfPower: 1520 },
	}),
	createMockDataPoint({
		timestamp: "2024-01-01T00:00:02.000Z",
		elapsedSec: 2,
		sensors: { temperature: 600, pressure: 8, rfPower: 2500 },
		isAnomaly: true,
		anomalyScore: 0.9,
	}),
	createMockDataPoint({
		timestamp: "2024-01-01T00:00:03.000Z",
		elapsedSec: 3,
		sensors: { temperature: 505, pressure: 5.1, rfPower: 1510 },
	}),
];

describe("findClosestDataPoint", () => {
	it("정확히 일치하는 타임스탬프를 찾는다", () => {
		const result = findClosestDataPoint(mockData, "2024-01-01T00:00:01.000Z");
		expect(result).toBeDefined();
		expect(result?.sensors.temperature).toBe(510);
	});

	it("가장 가까운 타임스탬프를 찾는다", () => {
		const result = findClosestDataPoint(mockData, "2024-01-01T00:00:01.500Z");
		expect(result?.timestamp).toBe("2024-01-01T00:00:01.000Z");
	});

	it("빈 배열이면 null을 반환한다", () => {
		expect(findClosestDataPoint([], "2024-01-01T00:00:00.000Z")).toBeNull();
	});

	it("범위 밖의 타임스탬프면 가장 가까운 끝 포인트를 반환한다", () => {
		const result = findClosestDataPoint(mockData, "2023-12-31T00:00:00.000Z");
		expect(result?.timestamp).toBe(mockData[0].timestamp);
	});
});

describe("buildRadarData", () => {
	it("센서 메타 수만큼 데이터를 반환한다", () => {
		const result = buildRadarData(mockData[0], mockData, MOCK_SENSORS_META);
		expect(result).toHaveLength(3);
	});

	it("각 항목에 sensor, label, value, max가 있다", () => {
		const result = buildRadarData(mockData[0], mockData, MOCK_SENSORS_META);
		for (const item of result) {
			expect(item.sensor).toBeDefined();
			expect(item.label).toBeDefined();
			expect(typeof item.value).toBe("number");
			expect(typeof item.max).toBe("number");
		}
	});

	it("max 값이 전체 데이터의 최대값 이상이다", () => {
		const result = buildRadarData(mockData[0], mockData, MOCK_SENSORS_META);
		const tempItem = result.find((r) => r.sensor === "temperature");
		expect(tempItem?.max).toBeGreaterThanOrEqual(600);
	});

	it("value가 해당 포인트의 센서 값과 일치한다", () => {
		const result = buildRadarData(mockData[2], mockData, MOCK_SENSORS_META);
		const tempItem = result.find((r) => r.sensor === "temperature");
		expect(tempItem?.value).toBe(600);
	});
});

describe("buildParameterTableData", () => {
	it("센서 메타 수만큼 데이터를 반환한다", () => {
		const result = buildParameterTableData(mockData[0], MOCK_SENSORS_META);
		expect(result).toHaveLength(3);
	});

	it("각 항목에 sensor, label, value, unit, status가 있다", () => {
		const result = buildParameterTableData(mockData[0], MOCK_SENSORS_META);
		for (const item of result) {
			expect(item.sensor).toBeDefined();
			expect(item.label).toBeDefined();
			expect(typeof item.value).toBe("number");
			expect(item.unit).toBeDefined();
			expect(["normal", "anomaly"]).toContain(item.status);
		}
	});

	it("정상 포인트는 status가 normal이다", () => {
		const result = buildParameterTableData(mockData[0], MOCK_SENSORS_META);
		for (const item of result) {
			expect(item.status).toBe("normal");
		}
	});

	it("이상 포인트는 status가 anomaly이다", () => {
		const result = buildParameterTableData(mockData[2], MOCK_SENSORS_META);
		for (const item of result) {
			expect(item.status).toBe("anomaly");
		}
	});
});
