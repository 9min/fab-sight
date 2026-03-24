/**
 * 개별 시점의 센서 및 AI 예측 데이터
 * @deprecated v0.3에서 ProcessDataPointV3 (types/fab.ts)로 대체 예정
 */
export interface ProcessDataPoint {
	timestamp: string; // ISO 8601
	temperature: number; // °C
	pressure: number; // Torr
	rfPower: number; // W
	isAnomaly: boolean;
	anomalyScore: number; // 0.0 ~ 1.0
}

/**
 * 전체 공정(Lot) 데이터 묶음
 * @deprecated v0.3에서 LotDataV3 (types/fab.ts)로 대체 예정
 */
export interface LotData {
	lotId: string;
	waferId: string;
	recipeName: string;
	startTime: string;
	endTime: string;
	data: ProcessDataPoint[];
}

/**
 * 센서 종류
 * @deprecated v0.3에서 동적 센서 키(string)로 대체 예정. SensorMeta (types/fab.ts) 참조
 */
export type SensorType = "temperature" | "pressure" | "rfPower";

/**
 * 센서 메타데이터
 * @deprecated v0.3에서 PROCESS_SENSORS (constants/sensorConfig.ts)로 대체 예정
 */
export const SENSOR_META: Record<SensorType, { label: string; unit: string; color: string }> = {
	temperature: { label: "Temperature", unit: "°C", color: "#EF4444" },
	pressure: { label: "Pressure", unit: "Torr", color: "#3B82F6" },
	rfPower: { label: "RF Power", unit: "W", color: "#F59E0B" },
};
