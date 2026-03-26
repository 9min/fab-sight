import type { LotDataV3, ProcessResult, WaferRun } from "@/types/fab";

export interface LotTrendPoint {
	runNumber: number;
	lotId: string;
	mean: number;
	min: number;
	max: number;
}

/** 단일 Wafer의 특정 스텝에서 센서 평균값을 계산한다 */
export function calculateStepMean(wafer: WaferRun, stepId: string, sensorKey: string): number {
	const stepPoints = wafer.data.filter((p) => p.stepId === stepId);
	if (stepPoints.length === 0) return 0;
	const sum = stepPoints.reduce((acc, p) => acc + (p.sensors[sensorKey] ?? 0), 0);
	return sum / stepPoints.length;
}

/** Lot 내 전체 Wafer의 특정 스텝 센서 평균값을 계산한다 */
export function calculateLotStepMean(lot: LotDataV3, stepId: string, sensorKey: string): number {
	if (lot.wafers.length === 0) return 0;
	const waferMeans = lot.wafers.map((w) => calculateStepMean(w, stepId, sensorKey));
	return waferMeans.reduce((acc, v) => acc + v, 0) / waferMeans.length;
}

/** 여러 Lot의 Run별 트렌드 데이터를 생성한다 */
export function buildLotTrendData(
	lots: LotDataV3[],
	stepId: string,
	sensorKey: string,
): LotTrendPoint[] {
	return lots
		.sort((a, b) => a.runNumber - b.runNumber)
		.map((lot) => {
			const waferMeans = lot.wafers.map((w) => calculateStepMean(w, stepId, sensorKey));
			const mean = waferMeans.reduce((acc, v) => acc + v, 0) / waferMeans.length;
			return {
				runNumber: lot.runNumber,
				lotId: lot.lotId,
				mean: Math.round(mean * 1000) / 1000,
				min: Math.round(Math.min(...waferMeans) * 1000) / 1000,
				max: Math.round(Math.max(...waferMeans) * 1000) / 1000,
			};
		});
}

/** 트렌드 데이터의 grand mean과 표준편차를 계산한다 */
export function calculateTrendStats(points: LotTrendPoint[]): { grandMean: number; sigma: number } {
	if (points.length === 0) return { grandMean: 0, sigma: 0 };
	const values = points.map((p) => p.mean);
	const grandMean = values.reduce((acc, v) => acc + v, 0) / values.length;
	const variance = values.reduce((acc, v) => acc + (v - grandMean) ** 2, 0) / values.length;
	return {
		grandMean: Math.round(grandMean * 1000) / 1000,
		sigma: Math.round(Math.sqrt(variance) * 1000) / 1000,
	};
}

/** ProcessResult에서 트렌드 바 데이터를 추출한다 */
export function buildResultTrendData(
	results: ProcessResult[],
	metric: "filmThickness" | "uniformity" | "defectCount",
): { runNumber: number; value: number }[] {
	return results
		.sort((a, b) => a.runNumber - b.runNumber)
		.map((r) => ({ runNumber: r.runNumber, value: r[metric] }));
}
