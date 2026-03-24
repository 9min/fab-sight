import { MOCK_SENSORS_META, createMockWaferRun } from "@/test/helpers";
import { describe, expect, it } from "vitest";
import { buildWaferCompareOverlay } from "./buildWaferCompareOverlay";

const wafers = [
	createMockWaferRun({ waferId: "WF-01", slotNumber: 1 }),
	createMockWaferRun({ waferId: "WF-02", slotNumber: 2 }),
	createMockWaferRun({ waferId: "WF-03", slotNumber: 3 }),
];

describe("buildWaferCompareOverlay", () => {
	it("show가 false이면 빈 배열을 반환한다", () => {
		const result = buildWaferCompareOverlay(
			wafers,
			["temperature"],
			MOCK_SENSORS_META,
			"WF-01",
			false,
		);
		expect(result).toEqual([]);
	});

	it("wafer가 1개 이하면 빈 배열을 반환한다", () => {
		const result = buildWaferCompareOverlay(
			[wafers[0]],
			["temperature"],
			MOCK_SENSORS_META,
			"WF-01",
			true,
		);
		expect(result).toEqual([]);
	});

	it("현재 Wafer를 제외한 나머지 Wafer × 센서 수만큼 시리즈를 생성한다", () => {
		const result = buildWaferCompareOverlay(
			wafers,
			["temperature", "pressure"],
			MOCK_SENSORS_META,
			"WF-01",
			true,
		);
		// 2 other wafers × 2 sensors = 4 series
		expect(result).toHaveLength(4);
	});

	it("오버레이 시리즈의 opacity가 0.35이다", () => {
		const result = buildWaferCompareOverlay(
			wafers,
			["temperature"],
			MOCK_SENSORS_META,
			"WF-01",
			true,
		);
		const series = result[0] as Record<string, unknown>;
		const lineStyle = series.lineStyle as Record<string, unknown>;
		expect(lineStyle.opacity).toBe(0.35);
	});

	it("시리즈 이름에 Wafer ID가 포함된다", () => {
		const result = buildWaferCompareOverlay(
			wafers,
			["temperature"],
			MOCK_SENSORS_META,
			"WF-01",
			true,
		);
		const names = result.map((s) => (s as Record<string, unknown>).name as string);
		expect(names.some((n) => n.includes("WF-02"))).toBe(true);
		expect(names.some((n) => n.includes("WF-03"))).toBe(true);
		expect(names.every((n) => !n.includes("WF-01"))).toBe(true);
	});
});
