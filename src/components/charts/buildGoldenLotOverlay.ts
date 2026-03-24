import { DOWNSAMPLE_TARGET, DOWNSAMPLE_THRESHOLD, GOLDEN_LOT_COLOR } from "@/constants/chart";
import type { ProcessDataPoint, SensorMeta } from "@/types/process";
import { type XAxisMode, extractSensorSeries, lttbDownsample } from "@/utils/downsample";
import type { SeriesOption } from "echarts";

/** Golden Lot 비교 오버레이 시리즈를 생성한다 */
export function buildGoldenLotOverlay(
	goldenData: ProcessDataPoint[],
	selectedSensors: string[],
	sensorsMeta: SensorMeta[],
	show: boolean,
	xAxisMode: XAxisMode = "wallClock",
): SeriesOption[] {
	if (!show || goldenData.length === 0) return [];

	const sensorMetaMap = new Map(sensorsMeta.map((m) => [m.key, m]));

	const unitToAxisIndex = new Map<string, number>();
	for (const sensorKey of selectedSensors) {
		const meta = sensorMetaMap.get(sensorKey);
		if (!meta) continue;
		if (!unitToAxisIndex.has(meta.unit)) {
			unitToAxisIndex.set(meta.unit, unitToAxisIndex.size);
		}
	}

	return selectedSensors
		.map((sensorKey) => {
			const meta = sensorMetaMap.get(sensorKey);
			if (!meta) return null;

			let seriesData = extractSensorSeries(goldenData, sensorKey, xAxisMode);
			if (seriesData.length > DOWNSAMPLE_THRESHOLD) {
				seriesData = lttbDownsample(seriesData, DOWNSAMPLE_TARGET);
			}

			const axisIndex = unitToAxisIndex.get(meta.unit) ?? 0;

			return {
				name: `Golden ${meta.label}`,
				type: "line" as const,
				yAxisIndex: axisIndex,
				showSymbol: false,
				clip: true,
				lineStyle: { color: GOLDEN_LOT_COLOR, type: "dashed" as const, width: 1.5, opacity: 0.7 },
				itemStyle: { color: GOLDEN_LOT_COLOR },
				data: seriesData.map((p) => [p.x, p.y]),
				z: 1,
			} satisfies SeriesOption;
		})
		.filter(Boolean) as SeriesOption[];
}
