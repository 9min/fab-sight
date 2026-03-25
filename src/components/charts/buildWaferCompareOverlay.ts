import { DOWNSAMPLE_TARGET, DOWNSAMPLE_THRESHOLD } from "@/constants/chart";
import type { SensorMeta, WaferRun } from "@/types/process";
import { type XAxisMode, extractSensorSeries, lttbDownsample } from "@/utils/downsample";
import type { SeriesOption } from "echarts";

/** 단일 Wafer × 센서 조합의 비교 시리즈를 생성한다 */
function buildWaferSensorSeries(
	wafer: WaferRun,
	sensorKey: string,
	sensorMetaMap: Map<string, SensorMeta>,
	unitToAxisIndex: Map<string, number>,
	xAxisMode: XAxisMode,
): SeriesOption | null {
	const meta = sensorMetaMap.get(sensorKey);
	if (!meta) return null;

	let seriesData = extractSensorSeries(wafer.data, sensorKey, xAxisMode);
	if (seriesData.length > DOWNSAMPLE_THRESHOLD) {
		seriesData = lttbDownsample(seriesData, DOWNSAMPLE_TARGET);
	}

	const axisIndex = unitToAxisIndex.get(meta.unit) ?? 0;

	return {
		name: `${wafer.waferId} ${meta.label}`,
		type: "line",
		yAxisIndex: axisIndex,
		showSymbol: false,
		clip: true,
		lineStyle: { color: meta.color, width: 1, opacity: 0.35 },
		itemStyle: { color: meta.color },
		data: seriesData.map((p) => [p.x, p.y]),
		z: 0,
	} satisfies SeriesOption;
}

/** Wafer-to-Wafer 비교 오버레이를 생성한다 */
export function buildWaferCompareOverlay(
	wafers: WaferRun[],
	selectedSensors: string[],
	sensorsMeta: SensorMeta[],
	currentWaferId: string,
	show: boolean,
	xAxisMode: XAxisMode = "elapsed",
): SeriesOption[] {
	if (!show || wafers.length <= 1) return [];

	const sensorMetaMap = new Map(sensorsMeta.map((m) => [m.key, m]));
	const otherWafers = wafers.filter((w) => w.waferId !== currentWaferId);

	const unitToAxisIndex = new Map<string, number>();
	for (const sensorKey of selectedSensors) {
		const meta = sensorMetaMap.get(sensorKey);
		if (!meta) continue;
		if (!unitToAxisIndex.has(meta.unit)) {
			unitToAxisIndex.set(meta.unit, unitToAxisIndex.size);
		}
	}

	const series: SeriesOption[] = [];

	for (const wafer of otherWafers) {
		for (const sensorKey of selectedSensors) {
			const result = buildWaferSensorSeries(
				wafer,
				sensorKey,
				sensorMetaMap,
				unitToAxisIndex,
				xAxisMode,
			);
			if (result) series.push(result);
		}
	}

	return series;
}
