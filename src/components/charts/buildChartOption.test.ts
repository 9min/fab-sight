import { MOCK_SENSORS_META, createMockDataPoints } from "@/test/helpers";
import { describe, expect, it } from "vitest";
import { buildChartOption } from "./buildChartOption";

const mockData = createMockDataPoints(3);

describe("buildChartOption", () => {
	it("선택된 센서 수만큼 시리즈를 생성한다", () => {
		const option = buildChartOption(
			mockData,
			["temperature", "pressure", "rfPower"],
			MOCK_SENSORS_META,
		);
		const series = option.series as unknown[];
		expect(series).toHaveLength(3);
	});

	it("하나의 센서만 선택하면 시리즈 1개를 생성한다", () => {
		const option = buildChartOption(mockData, ["temperature"], MOCK_SENSORS_META);
		const series = option.series as unknown[];
		expect(series).toHaveLength(1);
	});

	it("같은 단위의 센서는 Y축을 공유한다", () => {
		const option = buildChartOption(
			mockData,
			["temperature", "pressure", "rfPower"],
			MOCK_SENSORS_META,
		);
		const yAxis = option.yAxis as unknown[];
		// °C, Torr, W → 3개 단위 = 3개 축
		expect(yAxis).toHaveLength(3);
	});

	it("X축이 time 타입이다 (wallClock 모드)", () => {
		const option = buildChartOption(mockData, ["temperature"], MOCK_SENSORS_META, "wallClock");
		const xAxis = option.xAxis as Record<string, unknown>;
		expect(xAxis.type).toBe("time");
	});

	it("X축이 value 타입이다 (elapsed 모드)", () => {
		const option = buildChartOption(mockData, ["temperature"], MOCK_SENSORS_META, "elapsed");
		const xAxis = option.xAxis as Record<string, unknown>;
		expect(xAxis.type).toBe("value");
	});

	it("dataZoom이 설정되어 있다", () => {
		const option = buildChartOption(mockData, ["temperature"], MOCK_SENSORS_META);
		const dataZoom = option.dataZoom as unknown[];
		expect(dataZoom.length).toBeGreaterThanOrEqual(2);
	});

	it("tooltip이 설정되어 있다", () => {
		const option = buildChartOption(mockData, ["temperature"], MOCK_SENSORS_META);
		expect(option.tooltip).toBeDefined();
	});

	it("빈 데이터로도 옵션을 생성할 수 있다", () => {
		const option = buildChartOption([], ["temperature"], MOCK_SENSORS_META);
		expect(option).toBeDefined();
		const series = option.series as unknown[];
		expect(series).toHaveLength(1);
	});

	it("Y축 개수에 따라 grid right가 동적으로 계산된다", () => {
		// 1축: max(60, 0*60+20) = 60
		const opt1 = buildChartOption(mockData, ["temperature"], MOCK_SENSORS_META);
		const grid1 = opt1.grid as Record<string, unknown>;
		expect(grid1.right).toBe(60);

		// 3축 (°C, Torr, W): max(60, 2*60+20) = 140
		const opt3 = buildChartOption(
			mockData,
			["temperature", "pressure", "rfPower"],
			MOCK_SENSORS_META,
		);
		const grid3 = opt3.grid as Record<string, unknown>;
		expect(grid3.right).toBe(140);
	});

	it("빈 센서 목록으로도 옵션을 생성할 수 있다", () => {
		const option = buildChartOption(mockData, [], MOCK_SENSORS_META);
		expect(option).toBeDefined();
		const series = option.series as unknown[];
		expect(series).toHaveLength(0);
	});
});
