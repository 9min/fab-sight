import type { ProcessType, SensorMeta } from "@/types/fab";

/** 공정별 센서 설정 레지스트리 */
export const PROCESS_SENSORS: Record<ProcessType, SensorMeta[]> = {
	"CVD-PECVD": [
		{
			key: "temperature",
			label: "Temperature",
			unit: "°C",
			color: "#EF4444",
			specLimits: { usl: 420, lsl: 380, ucl: 415, lcl: 385, stepContext: "Deposition" },
		},
		{
			key: "pressure",
			label: "Pressure",
			unit: "Torr",
			color: "#3B82F6",
			specLimits: { usl: 4.0, lsl: 3.0, ucl: 3.8, lcl: 3.2, stepContext: "Deposition" },
		},
		{
			key: "rfPower",
			label: "RF Power",
			unit: "W",
			color: "#F59E0B",
			specLimits: { usl: 450, lsl: 350, ucl: 430, lcl: 370, stepContext: "Deposition" },
		},
		{
			key: "rfReflected",
			label: "RF Reflected",
			unit: "W",
			color: "#EC4899",
			specLimits: { usl: 25, lsl: 0, stepContext: "Deposition" },
		},
		{
			key: "SiH4_flow",
			label: "SiH4 Flow",
			unit: "sccm",
			color: "#22C55E",
			specLimits: { usl: 220, lsl: 180, ucl: 215, lcl: 185, stepContext: "Deposition" },
		},
		{
			key: "NH3_flow",
			label: "NH3 Flow",
			unit: "sccm",
			color: "#10B981",
			specLimits: { usl: 1100, lsl: 900, ucl: 1050, lcl: 950, stepContext: "Deposition" },
		},
		{ key: "N2_flow", label: "N2 Flow", unit: "sccm", color: "#14B8A6" },
		{ key: "spacing", label: "Spacing", unit: "mil", color: "#78716C" },
	],

	"CVD-LPCVD": [
		{
			key: "temperature",
			label: "Temperature",
			unit: "°C",
			color: "#EF4444",
			specLimits: { usl: 630, lsl: 610, ucl: 625, lcl: 615, stepContext: "Deposition" },
		},
		{
			key: "pressure",
			label: "Pressure",
			unit: "Torr",
			color: "#3B82F6",
			specLimits: { usl: 0.5, lsl: 0.1, ucl: 0.4, lcl: 0.2, stepContext: "Deposition" },
		},
		{ key: "SiH4_flow", label: "SiH4 Flow", unit: "sccm", color: "#22C55E" },
		{ key: "DCS_flow", label: "DCS Flow", unit: "sccm", color: "#10B981" },
		{ key: "N2_flow", label: "N2 Flow", unit: "sccm", color: "#14B8A6" },
	],

	"CVD-HDPCVD": [
		{
			key: "temperature",
			label: "Temperature",
			unit: "°C",
			color: "#EF4444",
			specLimits: { usl: 420, lsl: 380, stepContext: "Deposition" },
		},
		{
			key: "pressure",
			label: "Pressure",
			unit: "mTorr",
			color: "#3B82F6",
			specLimits: { usl: 12, lsl: 3, stepContext: "Deposition" },
		},
		{ key: "sourcePower", label: "Source Power", unit: "W", color: "#F59E0B" },
		{ key: "biasPower", label: "Bias Power", unit: "W", color: "#A855F7" },
		{ key: "SiH4_flow", label: "SiH4 Flow", unit: "sccm", color: "#22C55E" },
		{ key: "O2_flow", label: "O2 Flow", unit: "sccm", color: "#84CC16" },
	],

	"ETCH-OXIDE": [
		{
			key: "escTemperature",
			label: "ESC Temperature",
			unit: "°C",
			color: "#F97316",
			specLimits: { usl: 50, lsl: 30, ucl: 45, lcl: 35, stepContext: "Etch" },
		},
		{
			key: "pressure",
			label: "Pressure",
			unit: "mTorr",
			color: "#3B82F6",
			specLimits: { usl: 60, lsl: 40, ucl: 55, lcl: 45, stepContext: "Etch" },
		},
		{
			key: "sourcePower",
			label: "Source Power",
			unit: "W",
			color: "#F59E0B",
			specLimits: { usl: 1400, lsl: 1000, stepContext: "Etch" },
		},
		{
			key: "biasPower",
			label: "Bias Power",
			unit: "W",
			color: "#A855F7",
			specLimits: { usl: 700, lsl: 500, stepContext: "Etch" },
		},
		{ key: "CF4_flow", label: "CF4 Flow", unit: "sccm", color: "#22C55E" },
		{ key: "CHF3_flow", label: "CHF3 Flow", unit: "sccm", color: "#10B981" },
		{ key: "Ar_flow", label: "Ar Flow", unit: "sccm", color: "#84CC16" },
		{ key: "O2_flow", label: "O2 Flow", unit: "sccm", color: "#14B8A6" },
		{ key: "dcBias", label: "DC Bias", unit: "V", color: "#06B6D4" },
	],

	"ETCH-SI": [
		{
			key: "escTemperature",
			label: "ESC Temperature",
			unit: "°C",
			color: "#F97316",
			specLimits: { usl: 55, lsl: 45, stepContext: "Etch" },
		},
		{
			key: "pressure",
			label: "Pressure",
			unit: "mTorr",
			color: "#3B82F6",
			specLimits: { usl: 30, lsl: 10, stepContext: "Etch" },
		},
		{ key: "sourcePower", label: "Source Power", unit: "W", color: "#F59E0B" },
		{ key: "biasPower", label: "Bias Power", unit: "W", color: "#A855F7" },
		{ key: "Cl2_flow", label: "Cl2 Flow", unit: "sccm", color: "#22C55E" },
		{ key: "HBr_flow", label: "HBr Flow", unit: "sccm", color: "#10B981" },
		{ key: "O2_flow", label: "O2 Flow", unit: "sccm", color: "#84CC16" },
	],

	"ETCH-DEEP": [
		{
			key: "escTemperature",
			label: "ESC Temperature",
			unit: "°C",
			color: "#EF4444",
			specLimits: { usl: 25, lsl: 15, ucl: 23, lcl: 17, stepContext: "Etch Phase" },
		},
		{
			key: "pressure",
			label: "Pressure",
			unit: "mTorr",
			color: "#3B82F6",
			specLimits: { usl: 40, lsl: 15, ucl: 35, lcl: 20, stepContext: "Etch Phase" },
		},
		{
			key: "sourcePower",
			label: "Source Power",
			unit: "W",
			color: "#F59E0B",
			specLimits: { usl: 2200, lsl: 1800, stepContext: "Etch Phase" },
		},
		{
			key: "biasPower",
			label: "Bias Power",
			unit: "W",
			color: "#A855F7",
			specLimits: { usl: 200, lsl: 100, stepContext: "Etch Phase" },
		},
		{ key: "SF6_flow", label: "SF6 Flow", unit: "sccm", color: "#22C55E" },
		{ key: "C4F8_flow", label: "C4F8 Flow", unit: "sccm", color: "#10B981" },
		{ key: "Ar_flow", label: "Ar Flow", unit: "sccm", color: "#84CC16" },
	],
};

/** 공정 타입에 맞는 센서 목록을 반환한다 */
export function getSensorsForProcess(processType: ProcessType): SensorMeta[] {
	return PROCESS_SENSORS[processType];
}

/** 공정 타입과 센서 키로 센서 메타데이터를 조회한다 */
export function getSensorMeta(processType: ProcessType, sensorKey: string): SensorMeta | undefined {
	return PROCESS_SENSORS[processType].find((s) => s.key === sensorKey);
}
