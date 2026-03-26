import type { LotData, ProcessDataPoint, SensorMeta, WaferRun } from "@/types/process";

/** 테스트용 ProcessDataPoint 생성 헬퍼 */
export function createMockDataPoint(overrides: Partial<ProcessDataPoint> = {}): ProcessDataPoint {
	return {
		timestamp: new Date("2024-03-01T10:00:00Z").toISOString(),
		elapsedSec: 0,
		stepId: "test-step-1",
		sensors: { temperature: 400, pressure: 3.5, rfPower: 400 },
		isAnomaly: false,
		anomalyScore: 0.1,
		...overrides,
	};
}

/** 테스트용 ProcessDataPoint 배열 생성 (N개, 1초 간격) */
export function createMockDataPoints(
	count: number,
	overrides: Partial<ProcessDataPoint> = {},
): ProcessDataPoint[] {
	const baseTime = new Date("2024-03-01T10:00:00Z").getTime();
	return Array.from({ length: count }, (_, i) =>
		createMockDataPoint({
			timestamp: new Date(baseTime + i * 1000).toISOString(),
			elapsedSec: i,
			sensors: {
				temperature: 400 + Math.sin(i * 0.1) * 2,
				pressure: 3.5 + Math.sin(i * 0.1) * 0.05,
				rfPower: 400 + Math.sin(i * 0.1) * 5,
			},
			...overrides,
		}),
	);
}

/** 테스트용 WaferRun 생성 헬퍼 */
export function createMockWaferRun(overrides: Partial<WaferRun> = {}): WaferRun {
	const data = createMockDataPoints(100);
	return {
		waferId: "WF-01",
		slotNumber: 1,
		startTime: data[0].timestamp,
		endTime: data[data.length - 1].timestamp,
		data,
		...overrides,
	};
}

/** 테스트용 LotData 생성 헬퍼 */
export function createMockLotData(overrides: Partial<LotData> = {}): LotData {
	return {
		lotId: "LOT-TEST-001",
		recipeId: "recipe-test",
		recipeName: "CVD-STANDARD",
		equipmentId: "equip-test",
		chamberId: "ch-test",
		isGoldenLot: false,
		waferCount: 1,
		wafers: [createMockWaferRun()],
		runNumber: 1,
		...overrides,
	};
}

/** 테스트용 SensorMeta 목록 (3센서 기본) */
export const MOCK_SENSORS_META: SensorMeta[] = [
	{
		key: "temperature",
		label: "Temperature",
		unit: "°C",
		color: "#EF4444",
		specLimits: { usl: 420, lsl: 380 },
	},
	{
		key: "pressure",
		label: "Pressure",
		unit: "Torr",
		color: "#3B82F6",
		specLimits: { usl: 4.0, lsl: 3.0 },
	},
	{
		key: "rfPower",
		label: "RF Power",
		unit: "W",
		color: "#F59E0B",
		specLimits: { usl: 450, lsl: 350 },
	},
];
