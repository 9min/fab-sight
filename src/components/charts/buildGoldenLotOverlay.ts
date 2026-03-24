import {
	DOWNSAMPLE_TARGET,
	DOWNSAMPLE_THRESHOLD,
	GOLDEN_LOT_COLOR,
	GOLDEN_LOT_LINE_STYLE,
} from "@/constants/chart";
import type { ProcessDataPoint, SensorType } from "@/types/process";
import { SENSOR_META } from "@/types/process";
import { extractSensorSeries, lttbDownsample } from "@/utils/downsample";
import type { SeriesOption } from "echarts";

/** Golden Lot 오버레이 시리즈를 생성한다 */
export function buildGoldenLotOverlay(
	goldenData: ProcessDataPoint[],
	selectedSensors: SensorType[],
	show: boolean,
): SeriesOption[] {
	if (!show) return [];

	return selectedSensors.map((sensor, index) => {
		let seriesData = extractSensorSeries(goldenData, sensor);

		if (seriesData.length > DOWNSAMPLE_THRESHOLD) {
			seriesData = lttbDownsample(seriesData, DOWNSAMPLE_TARGET);
		}

		return {
			name: `Golden ${SENSOR_META[sensor].label}`,
			type: "line" as const,
			yAxisIndex: index,
			showSymbol: false,
			clip: true,
			lineStyle: {
				color: GOLDEN_LOT_COLOR,
				type: GOLDEN_LOT_LINE_STYLE,
				width: 1.5,
				opacity: 0.7,
			},
			itemStyle: {
				color: GOLDEN_LOT_COLOR,
			},
			data: seriesData.map((p) => [p.x, p.y]),
			z: 1,
		};
	});
}
