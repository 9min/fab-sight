import { getSensorsForProcess } from "@/constants/sensorConfig";
import { describe, expect, it } from "vitest";
import { generateWaferRuns } from "./generateProcessDataV3";
import { RECIPE_CVD_STANDARD, RECIPE_ETCH_DEEP } from "./recipes";

describe("generateWaferRuns", () => {
	const cvdSensors = getSensorsForProcess("CVD-PECVD");
	const etchSensors = getSensorsForProcess("ETCH-DEEP");

	it("지정된 수의 Wafer를 생성한다", () => {
		const wafers = generateWaferRuns({
			recipe: RECIPE_CVD_STANDARD,
			sensorsMeta: cvdSensors,
			waferCount: 3,
			anomalyRatio: 0,
			waferVariation: 0,
		});
		expect(wafers).toHaveLength(3);
	});

	it("각 Wafer에 slotNumber가 순서대로 할당된다", () => {
		const wafers = generateWaferRuns({
			recipe: RECIPE_CVD_STANDARD,
			sensorsMeta: cvdSensors,
			waferCount: 3,
			anomalyRatio: 0,
			waferVariation: 0,
		});
		expect(wafers[0].slotNumber).toBe(1);
		expect(wafers[1].slotNumber).toBe(2);
		expect(wafers[2].slotNumber).toBe(3);
	});

	it("데이터 포인트 수가 레시피 전체 duration과 일치한다", () => {
		const totalDuration = RECIPE_CVD_STANDARD.steps.reduce((sum, s) => sum + s.durationSec, 0);
		const wafers = generateWaferRuns({
			recipe: RECIPE_CVD_STANDARD,
			sensorsMeta: cvdSensors,
			waferCount: 1,
			anomalyRatio: 0,
			waferVariation: 0,
		});
		expect(wafers[0].data).toHaveLength(totalDuration);
	});

	it("elapsedSec가 0부터 단조 증가한다", () => {
		const wafers = generateWaferRuns({
			recipe: RECIPE_CVD_STANDARD,
			sensorsMeta: cvdSensors,
			waferCount: 1,
			anomalyRatio: 0,
			waferVariation: 0,
		});
		const data = wafers[0].data;
		expect(data[0].elapsedSec).toBe(0);
		for (let i = 1; i < data.length; i++) {
			expect(data[i].elapsedSec).toBe(data[i - 1].elapsedSec + 1);
		}
	});

	it("stepId가 레시피 스텝 경계에서 변경된다", () => {
		const wafers = generateWaferRuns({
			recipe: RECIPE_CVD_STANDARD,
			sensorsMeta: cvdSensors,
			waferCount: 1,
			anomalyRatio: 0,
			waferVariation: 0,
		});
		const data = wafers[0].data;
		const firstStepDuration = RECIPE_CVD_STANDARD.steps[0].durationSec;
		expect(data[0].stepId).toBe(RECIPE_CVD_STANDARD.steps[0].stepId);
		expect(data[firstStepDuration].stepId).toBe(RECIPE_CVD_STANDARD.steps[1].stepId);
	});

	it("sensors 객체에 모든 센서 키가 포함된다", () => {
		const wafers = generateWaferRuns({
			recipe: RECIPE_CVD_STANDARD,
			sensorsMeta: cvdSensors,
			waferCount: 1,
			anomalyRatio: 0,
			waferVariation: 0,
		});
		const sensorKeys = cvdSensors.map((s) => s.key);
		for (const point of wafers[0].data.slice(0, 5)) {
			for (const key of sensorKeys) {
				expect(point.sensors[key]).toBeDefined();
			}
		}
	});

	it("Deposition 스텝에서 센서값이 targetParams에 근접한다", () => {
		const wafers = generateWaferRuns({
			recipe: RECIPE_CVD_STANDARD,
			sensorsMeta: cvdSensors,
			waferCount: 1,
			anomalyRatio: 0,
			waferVariation: 0,
		});
		const depositionStep = RECIPE_CVD_STANDARD.steps.find((s) => s.name === "Deposition");
		if (!depositionStep) throw new Error("Deposition 스텝을 찾을 수 없다");

		const depositionPoints = wafers[0].data.filter((p) => p.stepId === depositionStep.stepId);
		const latePoints = depositionPoints.slice(-50);

		for (const point of latePoints) {
			expect(point.sensors.temperature).toBeGreaterThan(380);
			expect(point.sensors.temperature).toBeLessThan(420);
			expect(point.sensors.pressure).toBeGreaterThan(2.5);
			expect(point.sensors.pressure).toBeLessThan(4.5);
		}
	});

	it("anomalyRatio에 따라 이상 포인트가 생성된다", () => {
		const wafers = generateWaferRuns({
			recipe: RECIPE_CVD_STANDARD,
			sensorsMeta: cvdSensors,
			waferCount: 1,
			anomalyRatio: 0.1,
			waferVariation: 0,
		});
		const anomalyCount = wafers[0].data.filter((p) => p.isAnomaly).length;
		expect(anomalyCount).toBeGreaterThan(0);
	});

	it("이상 포인트에 anomalyType이 할당된다", () => {
		const wafers = generateWaferRuns({
			recipe: RECIPE_CVD_STANDARD,
			sensorsMeta: cvdSensors,
			waferCount: 1,
			anomalyRatio: 0.1,
			waferVariation: 0,
		});
		const anomalies = wafers[0].data.filter((p) => p.isAnomaly);
		for (const p of anomalies) {
			expect(p.anomalyType).toBeDefined();
		}
	});

	it("Wafer 간 센서값에 미세 차이가 있다 (waferVariation > 0)", () => {
		const wafers = generateWaferRuns({
			recipe: RECIPE_CVD_STANDARD,
			sensorsMeta: cvdSensors,
			waferCount: 3,
			anomalyRatio: 0,
			waferVariation: 0.03,
		});
		const idx = 200;
		const w1Temp = wafers[0].data[idx].sensors.temperature;
		const w2Temp = wafers[1].data[idx].sensors.temperature;
		expect(w1Temp).not.toBe(w2Temp);
	});

	it("ETCH-DEEP 레시피에서도 정상 생성된다", () => {
		const wafers = generateWaferRuns({
			recipe: RECIPE_ETCH_DEEP,
			sensorsMeta: etchSensors,
			waferCount: 1,
			anomalyRatio: 0,
			waferVariation: 0,
		});
		const totalDuration = RECIPE_ETCH_DEEP.steps.reduce((sum, s) => sum + s.durationSec, 0);
		expect(wafers[0].data).toHaveLength(totalDuration);
		expect(wafers[0].data[0].sensors.escTemperature).toBeDefined();
	});
});
