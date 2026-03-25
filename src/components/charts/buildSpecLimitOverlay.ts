import type { SensorMeta, SpecLimits } from "@/types/process";
import type { SeriesOption } from "echarts";

type LimitLine = { yAxis: number; name: string; lineStyle: { color: string; type: "dashed" } };

const LIMIT_DEFS: { key: keyof SpecLimits; suffix: string; color: string }[] = [
	{ key: "usl", suffix: "USL", color: "#DC2626" },
	{ key: "lsl", suffix: "LSL", color: "#DC2626" },
	{ key: "ucl", suffix: "UCL", color: "#F59E0B" },
	{ key: "lcl", suffix: "LCL", color: "#F59E0B" },
];

function buildLimitLines(label: string, limits: SpecLimits): LimitLine[] {
	const lines: LimitLine[] = [];
	for (const def of LIMIT_DEFS) {
		const value = limits[def.key];
		if (value !== undefined) {
			lines.push({
				yAxis: value,
				name: `${label} ${def.suffix}`,
				lineStyle: { color: def.color, type: "dashed" },
			});
		}
	}
	return lines;
}

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
		const markLineData = buildLimitLines(meta.label, meta.specLimits);

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
