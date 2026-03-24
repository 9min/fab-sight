import {
	ANOMALY_HIGH_COLOR,
	ANOMALY_MEDIUM_COLOR,
	ANOMALY_THRESHOLD_HIGH,
} from "@/constants/chart";
import type { ProcessDataPoint } from "@/types/process";
import type { SeriesOption } from "echarts";

/** 이상 탐지 오버레이 시리즈를 생성한다 */
export function buildAnomalyOverlay(data: ProcessDataPoint[], show: boolean): SeriesOption[] {
	if (!show) return [];

	const anomalyPoints = data.filter((p) => p.isAnomaly);

	const scatterData = anomalyPoints.map((point) => {
		const color =
			point.anomalyScore > ANOMALY_THRESHOLD_HIGH ? ANOMALY_HIGH_COLOR : ANOMALY_MEDIUM_COLOR;

		return {
			value: [new Date(point.timestamp).getTime(), point.temperature],
			itemStyle: { color },
			anomalyScore: point.anomalyScore,
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
