import type { SensorMeta } from "@/types/process";
import type { SeriesOption } from "echarts";

/** Spec Limit 수평선 오버레이를 생성한다 */
export function buildSpecLimitOverlay(
	selectedSensors: string[],
	sensorsMeta: SensorMeta[],
	show: boolean,
): SeriesOption[] {
	if (!show) return [];

	const sensorMetaMap = new Map(sensorsMeta.map((m) => [m.key, m]));

	const unitToAxisIndex = new Map<string, number>();
	for (const sensorKey of selectedSensors) {
		const meta = sensorMetaMap.get(sensorKey);
		if (!meta) continue;
		if (!unitToAxisIndex.has(meta.unit)) {
			unitToAxisIndex.set(meta.unit, unitToAxisIndex.size);
		}
	}

	const series: SeriesOption[] = [];

	for (const sensorKey of selectedSensors) {
		const meta = sensorMetaMap.get(sensorKey);
		if (!meta?.specLimits) continue;

		const axisIndex = unitToAxisIndex.get(meta.unit) ?? 0;
		const limits = meta.specLimits;
		const markLineData: {
			yAxis: number;
			name: string;
			lineStyle: { color: string; type: "dashed" };
		}[] = [];

		if (limits.usl !== undefined) {
			markLineData.push({
				yAxis: limits.usl,
				name: `${meta.label} USL`,
				lineStyle: { color: "#DC2626", type: "dashed" },
			});
		}
		if (limits.lsl !== undefined) {
			markLineData.push({
				yAxis: limits.lsl,
				name: `${meta.label} LSL`,
				lineStyle: { color: "#DC2626", type: "dashed" },
			});
		}
		if (limits.ucl !== undefined) {
			markLineData.push({
				yAxis: limits.ucl,
				name: `${meta.label} UCL`,
				lineStyle: { color: "#F59E0B", type: "dashed" },
			});
		}
		if (limits.lcl !== undefined) {
			markLineData.push({
				yAxis: limits.lcl,
				name: `${meta.label} LCL`,
				lineStyle: { color: "#F59E0B", type: "dashed" },
			});
		}

		if (markLineData.length > 0) {
			series.push({
				type: "line",
				name: `${meta.label} Limits`,
				yAxisIndex: axisIndex,
				data: [],
				markLine: {
					silent: true,
					symbol: "none",
					label: { show: true, position: "insideEndTop", fontSize: 9, color: "#94A3B8" },
					data: markLineData,
				},
			} satisfies SeriesOption);
		}
	}

	return series;
}
