import { MOCK_SENSORS_META } from "@/test/helpers";
import { describe, expect, it } from "vitest";
import { buildSpecLimitOverlay } from "./buildSpecLimitOverlay";

describe("buildSpecLimitOverlay", () => {
	it("show가 false이면 빈 배열을 반환한다", () => {
		expect(buildSpecLimitOverlay(["temperature"], MOCK_SENSORS_META, false)).toEqual([]);
	});

	it("show가 true이면 시리즈를 반환한다", () => {
		const result = buildSpecLimitOverlay(["temperature"], MOCK_SENSORS_META, true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("specLimits가 있는 센서에 대해 markLine이 생성된다", () => {
		const result = buildSpecLimitOverlay(["temperature"], MOCK_SENSORS_META, true);
		const series = result[0] as Record<string, unknown>;
		const markLine = series.markLine as Record<string, unknown>;
		const data = markLine.data as Array<Record<string, unknown>>;
		// temperature: usl=420, lsl=380 → 2개 라인
		expect(data.length).toBeGreaterThanOrEqual(2);
	});

	it("USL/LSL은 빨간 점선이다", () => {
		const result = buildSpecLimitOverlay(["temperature"], MOCK_SENSORS_META, true);
		const series = result[0] as Record<string, unknown>;
		const markLine = series.markLine as Record<string, unknown>;
		const data = markLine.data as Array<Record<string, unknown>>;
		const uslLine = data.find((d) => (d.name as string).includes("USL"));
		expect(uslLine).toBeDefined();
		const style = uslLine?.lineStyle as Record<string, unknown>;
		expect(style.color).toBe("#DC2626");
		expect(style.type).toBe("dashed");
	});

	it("specLimits가 없는 센서는 시리즈를 생성하지 않는다", () => {
		const sensorsNoLimits = [{ key: "N2_flow", label: "N2 Flow", unit: "sccm", color: "#14B8A6" }];
		const result = buildSpecLimitOverlay(["N2_flow"], sensorsNoLimits, true);
		expect(result).toHaveLength(0);
	});
});
