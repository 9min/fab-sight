import type { ProcessDataPoint, SensorType } from "@/types/process";
import { describe, expect, it } from "vitest";
import { buildChartOption } from "./buildChartOption";

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
		anomalyScore: 0.85,
	},
	{
		timestamp: "2024-01-01T00:00:02.000Z",
		temperature: 505,
		pressure: 5.1,
		rfPower: 1510,
		isAnomaly: false,
		anomalyScore: 0.2,
	},
];

describe("buildChartOption", () => {
	it("선택된 센서 수만큼 시리즈를 생성한다", () => {
		const sensors: SensorType[] = ["temperature", "pressure", "rfPower"];
		const option = buildChartOption(mockData, sensors);
		const series = option.series as unknown[];
		expect(series).toHaveLength(3);
	});

	it("하나의 센서만 선택하면 시리즈 1개를 생성한다", () => {
		const sensors: SensorType[] = ["temperature"];
		const option = buildChartOption(mockData, sensors);
		const series = option.series as unknown[];
		expect(series).toHaveLength(1);
	});

	it("선택된 센서 수만큼 Y축을 생성한다", () => {
		const sensors: SensorType[] = ["temperature", "pressure"];
		const option = buildChartOption(mockData, sensors);
		const yAxis = option.yAxis as unknown[];
		expect(yAxis).toHaveLength(2);
	});

	it("X축이 time 타입이다", () => {
		const sensors: SensorType[] = ["temperature"];
		const option = buildChartOption(mockData, sensors);
		const xAxis = option.xAxis as Record<string, unknown>;
		expect(xAxis.type).toBe("time");
	});

	it("dataZoom이 설정되어 있다", () => {
		const sensors: SensorType[] = ["temperature"];
		const option = buildChartOption(mockData, sensors);
		const dataZoom = option.dataZoom as unknown[];
		expect(dataZoom.length).toBeGreaterThanOrEqual(2);
	});

	it("tooltip이 설정되어 있다", () => {
		const sensors: SensorType[] = ["temperature"];
		const option = buildChartOption(mockData, sensors);
		expect(option.tooltip).toBeDefined();
	});

	it("빈 데이터로도 옵션을 생성할 수 있다", () => {
		const sensors: SensorType[] = ["temperature"];
		const option = buildChartOption([], sensors);
		expect(option).toBeDefined();
		const series = option.series as unknown[];
		expect(series).toHaveLength(1);
	});

	it("빈 센서 목록으로도 옵션을 생성할 수 있다", () => {
		const option = buildChartOption(mockData, []);
		expect(option).toBeDefined();
		const series = option.series as unknown[];
		expect(series).toHaveLength(0);
	});
});
