import { describe, expect, it } from "vitest";
import { PROCESS_SENSORS, getSensorMeta, getSensorsForProcess } from "./sensorConfig";

describe("PROCESS_SENSORS", () => {
	it("CVD-PECVD는 8개 센서를 포함한다", () => {
		const sensors = PROCESS_SENSORS["CVD-PECVD"];
		expect(sensors).toHaveLength(8);
	});

	it("ETCH-DEEP는 7개 센서를 포함한다", () => {
		const sensors = PROCESS_SENSORS["ETCH-DEEP"];
		expect(sensors).toHaveLength(7);
	});

	it("모든 센서는 key, label, unit, color를 가진다", () => {
		for (const [, sensors] of Object.entries(PROCESS_SENSORS)) {
			for (const sensor of sensors) {
				expect(sensor.key).toBeTruthy();
				expect(sensor.label).toBeTruthy();
				expect(sensor.unit).toBeTruthy();
				expect(sensor.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
			}
		}
	});

	it("CVD 공정의 압력 단위는 Torr이다", () => {
		const cvdPressure = PROCESS_SENSORS["CVD-PECVD"].find((s) => s.key === "pressure");
		expect(cvdPressure?.unit).toBe("Torr");
	});

	it("Etch 공정의 압력 단위는 mTorr이다", () => {
		const etchPressure = PROCESS_SENSORS["ETCH-DEEP"].find((s) => s.key === "pressure");
		expect(etchPressure?.unit).toBe("mTorr");
	});

	it("같은 공정 내에서 센서 key가 중복되지 않는다", () => {
		for (const [, sensors] of Object.entries(PROCESS_SENSORS)) {
			const keys = sensors.map((s) => s.key);
			expect(new Set(keys).size).toBe(keys.length);
		}
	});

	it("CVD-PECVD의 temperature 센서에 specLimits가 정의되어 있다", () => {
		const temp = PROCESS_SENSORS["CVD-PECVD"].find((s) => s.key === "temperature");
		expect(temp?.specLimits).toBeDefined();
		expect(temp?.specLimits?.usl).toBeGreaterThan(0);
		expect(temp?.specLimits?.lsl).toBeGreaterThan(0);
	});

	it("CVD-PECVD의 pressure 센서에 specLimits가 정의되어 있다", () => {
		const pressure = PROCESS_SENSORS["CVD-PECVD"].find((s) => s.key === "pressure");
		expect(pressure?.specLimits).toBeDefined();
		expect(pressure?.specLimits?.usl).toBeGreaterThan(pressure?.specLimits?.lsl ?? 0);
	});
});

describe("getSensorsForProcess", () => {
	it("유효한 공정 타입에 대해 센서 목록을 반환한다", () => {
		const sensors = getSensorsForProcess("CVD-PECVD");
		expect(sensors.length).toBeGreaterThan(0);
	});
});

describe("getSensorMeta", () => {
	it("유효한 센서 키에 대해 메타데이터를 반환한다", () => {
		const meta = getSensorMeta("CVD-PECVD", "temperature");
		expect(meta).toBeDefined();
		expect(meta?.label).toBe("Temperature");
		expect(meta?.unit).toBe("°C");
	});

	it("존재하지 않는 센서 키에 대해 undefined를 반환한다", () => {
		const meta = getSensorMeta("CVD-PECVD", "nonexistent");
		expect(meta).toBeUndefined();
	});
});
