import type { RadarDataItem } from "@/utils/drilldownUtils";
import { describe, expect, it } from "vitest";
import { buildRadarOption } from "./buildRadarOption";

const mockRadarData: RadarDataItem[] = [
	{ sensor: "temperature", label: "Temperature", value: 550, max: 900 },
	{ sensor: "pressure", label: "Pressure", value: 5, max: 12 },
	{ sensor: "rfPower", label: "RF Power", value: 1500, max: 3500 },
];

describe("buildRadarOption", () => {
	it("radar indicator 수가 데이터 길이와 일치한다", () => {
		const option = buildRadarOption(mockRadarData);
		const radar = (option.radar as Record<string, unknown>[])[0];
		const indicator = radar.indicator as unknown[];
		expect(indicator).toHaveLength(3);
	});

	it("series data 값이 올바르게 매핑된다", () => {
		const option = buildRadarOption(mockRadarData);
		const series = (option.series as Record<string, unknown>[])[0];
		const data = series.data as Array<Record<string, unknown>>;
		const values = data[0].value as number[];
		expect(values).toEqual([550, 5, 1500]);
	});

	it("빈 데이터 시 빈 indicator를 반환한다", () => {
		const option = buildRadarOption([]);
		const radar = (option.radar as Record<string, unknown>[])[0];
		const indicator = radar.indicator as unknown[];
		expect(indicator).toHaveLength(0);
	});

	it("tooltip이 설정되어 있다", () => {
		const option = buildRadarOption(mockRadarData);
		expect(option.tooltip).toBeDefined();
	});
});
