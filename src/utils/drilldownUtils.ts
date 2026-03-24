import type { ProcessDataPoint, SensorType } from "@/types/process";
import { SENSOR_META } from "@/types/process";

const SENSORS: SensorType[] = ["temperature", "pressure", "rfPower"];

/** 가장 가까운 타임스탬프의 데이터 포인트를 찾는다 (이진 탐색) */
export function findClosestDataPoint(
	data: ProcessDataPoint[],
	timestamp: string,
): ProcessDataPoint | null {
	if (data.length === 0) return null;

	const targetTime = new Date(timestamp).getTime();

	let left = 0;
	let right = data.length - 1;

	while (left < right) {
		const mid = Math.floor((left + right) / 2);
		const midTime = new Date(data[mid].timestamp).getTime();

		if (midTime < targetTime) {
			left = mid + 1;
		} else {
			right = mid;
		}
	}

	// left가 가장 가까운 후보. left-1도 확인
	if (left === 0) return data[0];

	const prevDiff = Math.abs(new Date(data[left - 1].timestamp).getTime() - targetTime);
	const currDiff = Math.abs(new Date(data[left].timestamp).getTime() - targetTime);

	return prevDiff <= currDiff ? data[left - 1] : data[left];
}

export interface RadarDataItem {
	sensor: SensorType;
	label: string;
	value: number;
	max: number;
}

/** 레이더 차트용 데이터를 생성한다 */
export function buildRadarData(
	point: ProcessDataPoint,
	allData: ProcessDataPoint[],
): RadarDataItem[] {
	return SENSORS.map((sensor) => {
		const values = allData.map((p) => p[sensor]);
		const max = Math.max(...values);

		return {
			sensor,
			label: SENSOR_META[sensor].label,
			value: point[sensor],
			max: max * 1.1,
		};
	});
}

export interface ParameterTableRow {
	sensor: SensorType;
	label: string;
	value: number;
	unit: string;
	status: "normal" | "anomaly";
}

/** 파라미터 테이블용 데이터를 생성한다 */
export function buildParameterTableData(point: ProcessDataPoint): ParameterTableRow[] {
	return SENSORS.map((sensor) => ({
		sensor,
		label: SENSOR_META[sensor].label,
		value: point[sensor],
		unit: SENSOR_META[sensor].unit,
		status: point.isAnomaly ? "anomaly" : "normal",
	}));
}
