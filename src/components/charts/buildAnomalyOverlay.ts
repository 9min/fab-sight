import { ANOMALY_MARKERS } from "@/constants/anomalyConfig";
import {
	ANOMALY_HIGH_COLOR,
	ANOMALY_MEDIUM_COLOR,
	ANOMALY_THRESHOLD_HIGH,
} from "@/constants/chart";
import type { ProcessDataPoint } from "@/types/process";
import type { XAxisMode } from "@/utils/downsample";
import type { SeriesOption } from "echarts";

/** 이상 탐지 오버레이 시리즈를 생성한다 */
export function buildAnomalyOverlay(
	data: ProcessDataPoint[],
	show: boolean,
	primarySensorKey: string,
	xAxisMode: XAxisMode = "wallClock",
): SeriesOption[] {
	if (!show) return [];

	const anomalyPoints = data.filter((p) => p.isAnomaly);

	const scatterData = anomalyPoints.map((point) => {
		const marker = point.anomalyType ? ANOMALY_MARKERS[point.anomalyType] : undefined;
		const color =
			marker?.color ??
			(point.anomalyScore > ANOMALY_THRESHOLD_HIGH ? ANOMALY_HIGH_COLOR : ANOMALY_MEDIUM_COLOR);
		const symbol = marker?.symbol ?? "circle";

		const xValue = xAxisMode === "elapsed" ? point.elapsedSec : new Date(point.timestamp).getTime();
		const yValue = point.sensors[primarySensorKey] ?? 0;

		return {
			value: [xValue, yValue],
			itemStyle: { color },
			symbol,
			anomalyScore: point.anomalyScore,
			anomalyType: point.anomalyType,
		};
	});

	const anomalyScatter: SeriesOption = {
		name: "이상 탐지",
		type: "scatter",
		data: scatterData,
		symbolSize: 8,
		z: 10,
	};

	return [anomalyScatter];
}
