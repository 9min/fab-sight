import type { LotData, ProcessDataPoint } from "@/types/process";

interface GenerateLotOptions {
	lotId: string;
	waferId: string;
	recipeName: string;
	pointCount: number;
	anomalyRatio: number;
}

/** 현실적인 반도체 공정 센서 데이터를 생성한다 */
export function generateLotData(options: GenerateLotOptions): LotData {
	const { lotId, waferId, recipeName, pointCount, anomalyRatio } = options;
	const data = generateDataPoints(pointCount, anomalyRatio);

	return {
		lotId,
		waferId,
		recipeName,
		startTime: data[0].timestamp,
		endTime: data[data.length - 1].timestamp,
		data,
	};
}

/** 이상치 구간의 시작 인덱스들을 생성한다 */
function generateAnomalyRegions(pointCount: number, anomalyRatio: number): Set<number> {
	const anomalyIndices = new Set<number>();
	const totalAnomalies = Math.floor(pointCount * anomalyRatio);

	if (totalAnomalies === 0) return anomalyIndices;

	// 이상치를 연속 구간(클러스터)으로 배치하여 현실적인 패턴 생성
	const clusterCount = Math.max(1, Math.floor(totalAnomalies / 15));
	const pointsPerCluster = Math.ceil(totalAnomalies / clusterCount);

	for (let c = 0; c < clusterCount; c++) {
		const startIdx = Math.floor(Math.random() * (pointCount - pointsPerCluster - 1)) + 1;
		for (let i = 0; i < pointsPerCluster; i++) {
			const idx = startIdx + i;
			if (idx < pointCount) {
				anomalyIndices.add(idx);
			}
		}
	}

	return anomalyIndices;
}

function generateDataPoints(pointCount: number, anomalyRatio: number): ProcessDataPoint[] {
	const anomalyIndices = generateAnomalyRegions(pointCount, anomalyRatio);

	// 기준 값 (정상 공정 중심값)
	const BASE_TEMP = 550;
	const BASE_PRESSURE = 5;
	const BASE_RF = 1500;

	// 시작 시간: 현재로부터 pointCount초 전
	const startTime = Date.now() - pointCount * 1000;

	const data: ProcessDataPoint[] = [];

	let temp = BASE_TEMP;
	let pressure = BASE_PRESSURE;
	let rf = BASE_RF;

	for (let i = 0; i < pointCount; i++) {
		const isAnomaly = anomalyIndices.has(i);

		// 랜덤 워크로 현실적인 시계열 생성
		temp += (Math.random() - 0.5) * 10;
		pressure += (Math.random() - 0.5) * 0.3;
		rf += (Math.random() - 0.5) * 50;

		// 정상 범위로 회귀하는 힘 적용
		temp += (BASE_TEMP - temp) * 0.02;
		pressure += (BASE_PRESSURE - pressure) * 0.02;
		rf += (BASE_RF - rf) * 0.02;

		if (isAnomaly) {
			// 이상치: 값을 급격하게 벗어나게 함
			const spike = (Math.random() - 0.3) * 2;
			temp += spike * 80;
			pressure += spike * 2;
			rf += spike * 400;
		}

		// 값 범위 제한
		temp = clamp(temp, 250, 850);
		pressure = clamp(pressure, 0.2, 12);
		rf = clamp(rf, 80, 3200);

		const anomalyScore = isAnomaly ? 0.5 + Math.random() * 0.5 : Math.random() * 0.3;

		const timestamp = new Date(startTime + i * 1000).toISOString();

		data.push({
			timestamp,
			temperature: round(temp, 1),
			pressure: round(pressure, 2),
			rfPower: round(rf, 0),
			isAnomaly,
			anomalyScore: round(anomalyScore, 3),
		});
	}

	return data;
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals: number): number {
	const factor = 10 ** decimals;
	return Math.round(value * factor) / factor;
}
