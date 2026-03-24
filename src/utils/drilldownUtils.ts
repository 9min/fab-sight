import type { ProcessDataPoint, SensorMeta } from "@/types/process";

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

	if (left === 0) return data[0];

	const prevDiff = Math.abs(new Date(data[left - 1].timestamp).getTime() - targetTime);
	const currDiff = Math.abs(new Date(data[left].timestamp).getTime() - targetTime);

	return prevDiff <= currDiff ? data[left - 1] : data[left];
}

export interface RadarDataItem {
	sensor: string;
	label: string;
	value: number;
	max: number;
}

/** 레이더 차트용 데이터를 생성한다 */
export function buildRadarData(
	point: ProcessDataPoint,
	allData: ProcessDataPoint[],
	sensorsMeta: SensorMeta[],
): RadarDataItem[] {
	return sensorsMeta.map((meta) => {
		const values = allData.map((p) => p.sensors[meta.key] ?? 0);
		const max = Math.max(...values);

		return {
			sensor: meta.key,
			label: meta.label,
			value: point.sensors[meta.key] ?? 0,
			max: max * 1.1,
		};
	});
}

export interface ParameterTableRow {
	sensor: string;
	label: string;
	value: number;
	unit: string;
	color: string;
	status: "normal" | "anomaly";
}

/** 파라미터 테이블용 데이터를 생성한다 */
export function buildParameterTableData(
	point: ProcessDataPoint,
	sensorsMeta: SensorMeta[],
): ParameterTableRow[] {
	return sensorsMeta.map((meta) => ({
		sensor: meta.key,
		label: meta.label,
		value: point.sensors[meta.key] ?? 0,
		unit: meta.unit,
		color: meta.color,
		status: point.isAnomaly ? "anomaly" : "normal",
	}));
}
