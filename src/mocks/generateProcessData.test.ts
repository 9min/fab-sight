import { describe, expect, it } from "vitest";
import { generateLotData } from "./generateProcessData";

describe("generateLotData", () => {
	it("지정된 개수만큼 데이터 포인트를 생성한다", () => {
		const lot = generateLotData({
			lotId: "LOT-001",
			waferId: "WF-01",
			recipeName: "CVD-STANDARD",
			pointCount: 100,
			anomalyRatio: 0.1,
		});

		expect(lot.data).toHaveLength(100);
		expect(lot.lotId).toBe("LOT-001");
		expect(lot.waferId).toBe("WF-01");
		expect(lot.recipeName).toBe("CVD-STANDARD");
	});

	it("타임스탬프가 시간순으로 정렬되어 있다", () => {
		const lot = generateLotData({
			lotId: "LOT-001",
			waferId: "WF-01",
			recipeName: "TEST",
			pointCount: 50,
			anomalyRatio: 0,
		});

		for (let i = 1; i < lot.data.length; i++) {
			const prev = new Date(lot.data[i - 1].timestamp).getTime();
			const curr = new Date(lot.data[i].timestamp).getTime();
			expect(curr).toBeGreaterThan(prev);
		}
	});

	it("온도 값이 현실적인 범위(300~800°C) 내에 있다", () => {
		const lot = generateLotData({
			lotId: "LOT-001",
			waferId: "WF-01",
			recipeName: "TEST",
			pointCount: 1000,
			anomalyRatio: 0.1,
		});

		for (const point of lot.data) {
			expect(point.temperature).toBeGreaterThanOrEqual(200);
			expect(point.temperature).toBeLessThanOrEqual(900);
		}
	});

	it("압력 값이 현실적인 범위(0.5~10 Torr) 내에 있다", () => {
		const lot = generateLotData({
			lotId: "LOT-001",
			waferId: "WF-01",
			recipeName: "TEST",
			pointCount: 1000,
			anomalyRatio: 0.1,
		});

		for (const point of lot.data) {
			expect(point.pressure).toBeGreaterThanOrEqual(0.1);
			expect(point.pressure).toBeLessThanOrEqual(15);
		}
	});

	it("RF Power 값이 현실적인 범위(100~3000W) 내에 있다", () => {
		const lot = generateLotData({
			lotId: "LOT-001",
			waferId: "WF-01",
			recipeName: "TEST",
			pointCount: 1000,
			anomalyRatio: 0.1,
		});

		for (const point of lot.data) {
			expect(point.rfPower).toBeGreaterThanOrEqual(50);
			expect(point.rfPower).toBeLessThanOrEqual(3500);
		}
	});

	it("이상치 비율이 대략 지정된 비율과 일치한다", () => {
		const lot = generateLotData({
			lotId: "LOT-001",
			waferId: "WF-01",
			recipeName: "TEST",
			pointCount: 1000,
			anomalyRatio: 0.1,
		});

		const anomalyCount = lot.data.filter((p) => p.isAnomaly).length;
		const ratio = anomalyCount / lot.data.length;
		expect(ratio).toBeGreaterThan(0.03);
		expect(ratio).toBeLessThan(0.25);
	});

	it("이상치 포인트는 anomalyScore가 0.5 이상이다", () => {
		const lot = generateLotData({
			lotId: "LOT-001",
			waferId: "WF-01",
			recipeName: "TEST",
			pointCount: 500,
			anomalyRatio: 0.15,
		});

		const anomalies = lot.data.filter((p) => p.isAnomaly);
		expect(anomalies.length).toBeGreaterThan(0);
		for (const point of anomalies) {
			expect(point.anomalyScore).toBeGreaterThanOrEqual(0.5);
			expect(point.anomalyScore).toBeLessThanOrEqual(1.0);
		}
	});

	it("정상 포인트는 anomalyScore가 0.5 미만이다", () => {
		const lot = generateLotData({
			lotId: "LOT-001",
			waferId: "WF-01",
			recipeName: "TEST",
			pointCount: 500,
			anomalyRatio: 0.1,
		});

		const normals = lot.data.filter((p) => !p.isAnomaly);
		for (const point of normals) {
			expect(point.anomalyScore).toBeGreaterThanOrEqual(0);
			expect(point.anomalyScore).toBeLessThan(0.5);
		}
	});

	it("startTime과 endTime이 올바르게 설정된다", () => {
		const lot = generateLotData({
			lotId: "LOT-001",
			waferId: "WF-01",
			recipeName: "TEST",
			pointCount: 100,
			anomalyRatio: 0,
		});

		expect(lot.startTime).toBe(lot.data[0].timestamp);
		expect(lot.endTime).toBe(lot.data[lot.data.length - 1].timestamp);
	});

	it("10000개 이상의 포인트를 생성할 수 있다", () => {
		const lot = generateLotData({
			lotId: "LOT-001",
			waferId: "WF-01",
			recipeName: "TEST",
			pointCount: 10000,
			anomalyRatio: 0.05,
		});

		expect(lot.data).toHaveLength(10000);
	});
});
