import type { AnomalyType } from "@/types/fab";
import { describe, expect, it } from "vitest";
import { ANOMALY_MARKERS } from "./anomalyConfig";

const ALL_ANOMALY_TYPES: AnomalyType[] = [
	"drift",
	"spike",
	"shift",
	"oscillation",
	"out_of_range",
	"pattern",
];

describe("ANOMALY_MARKERS", () => {
	it("모든 AnomalyType에 대해 마커가 정의되어 있다", () => {
		for (const type of ALL_ANOMALY_TYPES) {
			expect(ANOMALY_MARKERS[type]).toBeDefined();
		}
	});

	it("각 마커는 symbol과 color를 가진다", () => {
		for (const type of ALL_ANOMALY_TYPES) {
			const marker = ANOMALY_MARKERS[type];
			expect(marker.symbol).toBeTruthy();
			expect(marker.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
		}
	});

	it("각 마커는 label을 가진다", () => {
		for (const type of ALL_ANOMALY_TYPES) {
			expect(ANOMALY_MARKERS[type].label).toBeTruthy();
		}
	});
});
