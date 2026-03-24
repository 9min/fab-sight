import { GOLDEN_LOT_COLOR } from "@/constants/chart";
import { MOCK_SENSORS_META, createMockDataPoints } from "@/test/helpers";
import { describe, expect, it } from "vitest";
import { buildGoldenLotOverlay } from "./buildGoldenLotOverlay";

const mockGoldenData = createMockDataPoints(3);

describe("buildGoldenLotOverlay", () => {
	it("show가 false이면 빈 배열을 반환한다", () => {
		const result = buildGoldenLotOverlay(
			mockGoldenData,
			["temperature", "pressure"],
			MOCK_SENSORS_META,
			false,
		);
		expect(result).toEqual([]);
	});

	it("show가 true이면 선택된 센서 수만큼 시리즈를 생성한다", () => {
		const result = buildGoldenLotOverlay(
			mockGoldenData,
			["temperature", "pressure", "rfPower"],
			MOCK_SENSORS_META,
			true,
		);
		expect(result).toHaveLength(3);
	});

	it("하나의 센서만 선택하면 시리즈 1개를 생성한다", () => {
		const result = buildGoldenLotOverlay(mockGoldenData, ["temperature"], MOCK_SENSORS_META, true);
		expect(result).toHaveLength(1);
	});

	it("각 시리즈의 lineStyle이 dashed이다", () => {
		const result = buildGoldenLotOverlay(mockGoldenData, ["temperature"], MOCK_SENSORS_META, true);
		const series = result[0] as Record<string, unknown>;
		const lineStyle = series.lineStyle as Record<string, unknown>;
		expect(lineStyle.type).toBe("dashed");
	});

	it("각 시리즈의 색상이 GOLDEN_LOT_COLOR이다", () => {
		const result = buildGoldenLotOverlay(mockGoldenData, ["temperature"], MOCK_SENSORS_META, true);
		const series = result[0] as Record<string, unknown>;
		const lineStyle = series.lineStyle as Record<string, unknown>;
		expect(lineStyle.color).toBe(GOLDEN_LOT_COLOR);
	});

	it("시리즈 이름에 Golden 접두어가 있다", () => {
		const result = buildGoldenLotOverlay(mockGoldenData, ["temperature"], MOCK_SENSORS_META, true);
		const series = result[0] as Record<string, unknown>;
		expect((series.name as string).startsWith("Golden")).toBe(true);
	});

	it("빈 데이터에서는 빈 배열을 반환한다", () => {
		const result = buildGoldenLotOverlay([], ["temperature"], MOCK_SENSORS_META, true);
		expect(result).toHaveLength(0);
	});
});
